from fastapi import APIRouter, HTTPException, File, UploadFile
from typing import List, Dict, Optional
from ..services.script_manager import ScriptManager

router = APIRouter()
script_manager = ScriptManager()

@router.get("/list")
async def list_scripts() -> List[Dict]:
    """Получение списка доступных скриптов"""
    return await script_manager.list_scripts()

@router.post("/upload")
async def upload_script(file: UploadFile = File(...)) -> Dict:
    """Загрузка нового скрипта"""
    content = await file.read()
    return await script_manager.upload_script(file.filename, content.decode())

@router.delete("/{filename}")
async def delete_script(filename: str) -> Dict:
    """Удаление скрипта"""
    return await script_manager.delete_script(filename)

@router.get("/{filename}/content")
async def get_script_content(filename: str) -> Dict:
    """Получение содержимого скрипта"""
    return await script_manager.get_script_content(filename)

@router.post("/{filename}/run")
async def run_script(filename: str, args: Optional[List[str]] = None) -> Dict:
    """Запуск скрипта"""
    return await script_manager.run_script(filename, args)

@router.post("/{script_id}/stop")
async def stop_script(script_id: str) -> Dict:
    """Остановка запущенного скрипта"""
    return await script_manager.stop_script(script_id)

@router.get("/{script_id}/output")
async def get_script_output(script_id: str) -> Dict:
    """Получение вывода скрипта"""
    return await script_manager.get_script_output(script_id)

@router.get("/running")
async def get_running_scripts() -> List[Dict]:
    """Получение списка запущенных скриптов"""
    return await script_manager.get_running_scripts() 