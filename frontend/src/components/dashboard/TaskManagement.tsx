import React from 'react';
import TaskItem from './TaskItem';

interface TaskManagementProps {
  tasks: {
    id: number;
    type: string;
    content: string;
    status: string;
    deadline: string;
  }[];
}

const TaskManagement: React.FC<TaskManagementProps> = ({ tasks }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">タスク管理</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">種別</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">内容</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ステータス</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">期限</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                type={task.type}
                content={task.content}
                status={task.status}
                deadline={task.deadline}
              />
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">1 to {tasks.length} of {tasks.length}</span>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            前へ
          </button>
          <span className="px-3 py-1 bg-blue-50 border border-blue-300 rounded-md text-sm text-blue-600">
            ページ 1 / 1
          </span>
          <button className="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" disabled>
            次へ
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskManagement;
