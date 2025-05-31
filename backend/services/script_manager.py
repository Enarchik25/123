import os
import json
import subprocess
import asyncio
from typing import List, Dict
from datetime import datetime
import aiofiles

class ScriptManager:
    def __init__(self):
        self.scripts_dir = "/opt/security/scripts"
        self.running_scripts = {}
        
        # Создаем директорию для скриптов, если её нет
        os.makedirs(self.scripts_dir, exist_ok=True)
        
    async def list_scripts(self) -> List[Dict]:
        """Получение списка доступных скриптов"""
        scripts = []
        for filename in os.listdir(self.scripts_dir):
            if filename.endswith(('.py', '.sh')):
                path = os.path.join(self.scripts_dir, filename)
                stats = os.stat(path)
                scripts.append({
                    "name": filename,
                    "size": stats.st_size,
                    "modified": datetime.fromtimestamp(stats.st_mtime).isoformat(),
                    "type": "python" if filename.endswith('.py') else "shell"
                })
        return scripts
        
    async def upload_script(self, filename: str, content: str) -> Dict:
        """Загрузка нового скрипта"""
        try:
            path = os.path.join(self.scripts_dir, filename)
            async with aiofiles.open(path, 'w') as f:
                await f.write(content)
                
            # Делаем скрипт исполняемым
            os.chmod(path, 0o755)
            
            return {
                "status": "success",
                "message": f"Script {filename} uploaded successfully"
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    async def delete_script(self, filename: str) -> Dict:
        """Удаление скрипта"""
        try:
            path = os.path.join(self.scripts_dir, filename)
            if os.path.exists(path):
                os.remove(path)
                return {
                    "status": "success",
                    "message": f"Script {filename} deleted successfully"
                }
            return {"status": "error", "message": "Script not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    async def get_script_content(self, filename: str) -> Dict:
        """Получение содержимого скрипта"""
        try:
            path = os.path.join(self.scripts_dir, filename)
            if os.path.exists(path):
                async with aiofiles.open(path, 'r') as f:
                    content = await f.read()
                return {
                    "status": "success",
                    "content": content
                }
            return {"status": "error", "message": "Script not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    async def run_script(self, filename: str, args: List[str] = None) -> Dict:
        """Запуск скрипта"""
        try:
            path = os.path.join(self.scripts_dir, filename)
            if not os.path.exists(path):
                return {"status": "error", "message": "Script not found"}
                
            # Определяем команду запуска
            if filename.endswith('.py'):
                cmd = ['python3', path]
            else:
                cmd = [path]
                
            # Добавляем аргументы
            if args:
                cmd.extend(args)
                
            # Запускаем процесс
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            # Сохраняем информацию о запущенном скрипте
            script_id = datetime.now().strftime("%Y%m%d_%H%M%S")
            self.running_scripts[script_id] = {
                "process": process,
                "filename": filename,
                "start_time": datetime.now(),
                "args": args
            }
            
            return {
                "status": "success",
                "script_id": script_id,
                "message": f"Script {filename} started"
            }
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    async def stop_script(self, script_id: str) -> Dict:
        """Остановка запущенного скрипта"""
        try:
            if script_id in self.running_scripts:
                script = self.running_scripts[script_id]
                script["process"].terminate()
                await script["process"].wait()
                del self.running_scripts[script_id]
                return {
                    "status": "success",
                    "message": f"Script {script['filename']} stopped"
                }
            return {"status": "error", "message": "Script not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    async def get_script_output(self, script_id: str) -> Dict:
        """Получение вывода скрипта"""
        try:
            if script_id in self.running_scripts:
                script = self.running_scripts[script_id]
                stdout, stderr = await script["process"].communicate()
                return {
                    "status": "success",
                    "stdout": stdout.decode(),
                    "stderr": stderr.decode()
                }
            return {"status": "error", "message": "Script not found"}
        except Exception as e:
            return {"status": "error", "message": str(e)}
            
    async def get_running_scripts(self) -> List[Dict]:
        """Получение списка запущенных скриптов"""
        return [{
            "id": k,
            "filename": v["filename"],
            "start_time": v["start_time"].isoformat(),
            "args": v["args"]
        } for k, v in self.running_scripts.items()] 