import React from 'react';
import { useState, useEffect } from 'react';
import fileUploadService from '../../services/fileUploadService';

interface FileUploaderProps {
  entityType: string;
  entityId: string;
  onUploadComplete?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ entityType, entityId, onUploadComplete }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('ファイルを選択してください');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      const formData = new FormData();
      formData.append('entityType', entityType);
      formData.append('entityId', entityId);

      if (files.length === 1) {
        formData.append('file', files[0]);
        await fileUploadService.uploadFile(formData);
      } else {
        files.forEach(file => {
          formData.append('files', file);
        });
        await fileUploadService.uploadMultipleFiles(formData);
      }

      setSuccess('ファイルのアップロードが完了しました');
      setFiles([]);

      if (onUploadComplete) {
        onUploadComplete();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'ファイルのアップロードに失敗しました');
      console.error('Failed to upload files:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <h4 className="font-semibold mb-2">ファイルアップロード</h4>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {success}
        </div>
      )}

      <div className="mb-4">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
        <p className="text-xs text-gray-500 mt-1">
          許可されているファイル形式: PDF, Word, Excel, JPEG, PNG, テキスト
        </p>
      </div>

      <div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className={`px-4 py-2 rounded text-white ${
            uploading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {uploading ? 'アップロード中...' : 'アップロード'}
        </button>
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <h5 className="font-semibold text-sm mb-1">選択されたファイル:</h5>
          <ul className="text-sm">
            {files.map((file, index) => (
              <li key={index} className="mb-1">
                {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
