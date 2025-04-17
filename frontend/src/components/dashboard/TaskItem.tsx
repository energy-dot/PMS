import React from 'react';

interface TaskItemProps {
  type: string;
  content: string;
  status: string;
  deadline: string;
}

const TaskItem: React.FC<TaskItemProps> = ({ type, content, status, deadline }) => {
  const getStatusColor = () => {
    switch (status) {
      case '承認待ち':
        return 'bg-yellow-100 text-yellow-800';
      case '審査進行中':
        return 'bg-blue-100 text-blue-800';
      case '更新待ち':
        return 'bg-purple-100 text-purple-800';
      case '未対応':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{type}</td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{content}</td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
          {status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{deadline}</td>
    </tr>
  );
};

export default TaskItem;
