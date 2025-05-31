import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Upload, Space, Tag, message, Input, Modal } from 'antd';
import { UploadOutlined, DeleteOutlined, PlayCircleOutlined, StopOutlined, EditOutlined } from '@ant-design/icons';
import { CodeEditor } from '@uiw/react-textarea-code-editor';

const ScriptManager = () => {
    const [scripts, setScripts] = useState([]);
    const [runningScripts, setRunningScripts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [currentScript, setCurrentScript] = useState(null);
    const [scriptContent, setScriptContent] = useState('');
    const [scriptArgs, setScriptArgs] = useState('');

    // Загрузка списка скриптов
    const loadScripts = async () => {
        try {
            const response = await fetch('/api/v1/scripts/list');
            const data = await response.json();
            setScripts(data);
        } catch (error) {
            message.error('Ошибка при загрузке списка скриптов');
        }
    };

    // Загрузка списка запущенных скриптов
    const loadRunningScripts = async () => {
        try {
            const response = await fetch('/api/v1/scripts/running');
            const data = await response.json();
            setRunningScripts(data);
        } catch (error) {
            console.error('Ошибка при загрузке списка запущенных скриптов:', error);
        }
    };

    // Периодическое обновление данных
    useEffect(() => {
        loadScripts();
        const interval = setInterval(() => {
            loadRunningScripts();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Загрузка содержимого скрипта
    const loadScriptContent = async (filename) => {
        try {
            const response = await fetch(`/api/v1/scripts/${filename}/content`);
            const data = await response.json();
            if (data.status === 'success') {
                setScriptContent(data.content);
                setCurrentScript(filename);
                setEditModalVisible(true);
            }
        } catch (error) {
            message.error('Ошибка при загрузке содержимого скрипта');
        }
    };

    // Удаление скрипта
    const deleteScript = async (filename) => {
        try {
            const response = await fetch(`/api/v1/scripts/${filename}`, {
                method: 'DELETE'
            });
            const data = await response.json();
            if (data.status === 'success') {
                message.success('Скрипт удален');
                loadScripts();
            }
        } catch (error) {
            message.error('Ошибка при удалении скрипта');
        }
    };

    // Запуск скрипта
    const runScript = async (filename) => {
        try {
            const args = scriptArgs.split(' ').filter(arg => arg);
            const response = await fetch(`/api/v1/scripts/${filename}/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ args })
            });
            const data = await response.json();
            if (data.status === 'success') {
                message.success('Скрипт запущен');
                loadRunningScripts();
            }
        } catch (error) {
            message.error('Ошибка при запуске скрипта');
        }
    };

    // Остановка скрипта
    const stopScript = async (scriptId) => {
        try {
            const response = await fetch(`/api/v1/scripts/${scriptId}/stop`, {
                method: 'POST'
            });
            const data = await response.json();
            if (data.status === 'success') {
                message.success('Скрипт остановлен');
                loadRunningScripts();
            }
        } catch (error) {
            message.error('Ошибка при остановке скрипта');
        }
    };

    // Настройки для загрузки файлов
    const uploadProps = {
        name: 'file',
        action: '/api/v1/scripts/upload',
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} успешно загружен`);
                loadScripts();
            } else if (info.file.status === 'error') {
                message.error(`Ошибка загрузки ${info.file.name}`);
            }
        },
    };

    // Колонки для таблицы скриптов
    const scriptsColumns = [
        {
            title: 'Имя',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Тип',
            dataIndex: 'type',
            key: 'type',
            render: (type) => {
                const colors = {
                    python: 'blue',
                    shell: 'green'
                };
                return <Tag color={colors[type]}>{type}</Tag>;
            }
        },
        {
            title: 'Размер',
            dataIndex: 'size',
            key: 'size',
            render: (size) => `${(size / 1024).toFixed(2)} KB`
        },
        {
            title: 'Изменен',
            dataIndex: 'modified',
            key: 'modified',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => loadScriptContent(record.name)}
                    >
                        Редактировать
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlayCircleOutlined />}
                        onClick={() => runScript(record.name)}
                    >
                        Запустить
                    </Button>
                    <Button
                        type="primary"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => deleteScript(record.name)}
                    >
                        Удалить
                    </Button>
                </Space>
            ),
        },
    ];

    // Колонки для таблицы запущенных скриптов
    const runningScriptsColumns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Скрипт',
            dataIndex: 'filename',
            key: 'filename',
        },
        {
            title: 'Аргументы',
            dataIndex: 'args',
            key: 'args',
            render: (args) => args ? args.join(' ') : ''
        },
        {
            title: 'Запущен',
            dataIndex: 'start_time',
            key: 'start_time',
        },
        {
            title: 'Действия',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    danger
                    icon={<StopOutlined />}
                    onClick={() => stopScript(record.id)}
                >
                    Остановить
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {/* Карточка управления */}
                <Card title="Управление скриптами">
                    <Space>
                        <Upload {...uploadProps}>
                            <Button icon={<UploadOutlined />}>Загрузить скрипт</Button>
                        </Upload>
                    </Space>
                </Card>

                {/* Таблица скриптов */}
                <Card title="Доступные скрипты">
                    <Table
                        columns={scriptsColumns}
                        dataSource={scripts}
                        rowKey="name"
                        pagination={false}
                    />
                </Card>

                {/* Таблица запущенных скриптов */}
                <Card title="Запущенные скрипты">
                    <Table
                        columns={runningScriptsColumns}
                        dataSource={runningScripts}
                        rowKey="id"
                        pagination={false}
                    />
                </Card>
            </Space>

            {/* Модальное окно редактирования */}
            <Modal
                title={`Редактирование ${currentScript}`}
                visible={editModalVisible}
                onCancel={() => setEditModalVisible(false)}
                width={800}
                footer={[
                    <Button key="cancel" onClick={() => setEditModalVisible(false)}>
                        Отмена
                    </Button>,
                    <Button
                        key="save"
                        type="primary"
                        onClick={async () => {
                            try {
                                const response = await fetch('/api/v1/scripts/upload', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                        filename: currentScript,
                                        content: scriptContent
                                    })
                                });
                                const data = await response.json();
                                if (data.status === 'success') {
                                    message.success('Скрипт сохранен');
                                    setEditModalVisible(false);
                                    loadScripts();
                                }
                            } catch (error) {
                                message.error('Ошибка при сохранении скрипта');
                            }
                        }}
                    >
                        Сохранить
                    </Button>
                ]}
            >
                <Space direction="vertical" style={{ width: '100%' }}>
                    <CodeEditor
                        value={scriptContent}
                        language={currentScript?.endsWith('.py') ? 'python' : 'shell'}
                        onChange={(e) => setScriptContent(e.target.value)}
                        padding={15}
                        style={{
                            fontSize: 12,
                            backgroundColor: "#f5f5f5",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
                    <Input
                        placeholder="Аргументы (через пробел)"
                        value={scriptArgs}
                        onChange={(e) => setScriptArgs(e.target.value)}
                    />
                </Space>
            </Modal>
        </div>
    );
};

export default ScriptManager; 