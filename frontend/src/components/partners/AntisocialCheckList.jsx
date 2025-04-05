import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import { format } from 'date-fns';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AntisocialCheckList = () => {
  const { partnerId } = useParams();
  const [checks, setChecks] = useState([]);
  const [partner, setPartner] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentCheck, setCurrentCheck] = useState({
    partnerId: partnerId,
    checkDate: new Date(),
    checkedBy: '',
    checkMethod: '',
    result: '要確認',
    expiryDate: null,
    documentFile: '',
    remarks: '',
    isCompleted: false
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPartner();
    fetchChecks();
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      const response = await axios.get(`/api/partners/${partnerId}`);
      setPartner(response.data);
    } catch (error) {
      console.error('パートナー情報の取得に失敗しました', error);
    }
  };

  const fetchChecks = async () => {
    try {
      const response = await axios.get(`/api/antisocial-checks/partner/${partnerId}`);
      setChecks(response.data);
    } catch (error) {
      console.error('反社チェック情報の取得に失敗しました', error);
    }
  };

  const handleOpenDialog = (check = null) => {
    if (check) {
      setCurrentCheck({
        ...check,
        checkDate: new Date(check.checkDate),
        expiryDate: check.expiryDate ? new Date(check.expiryDate) : null
      });
      setIsEditing(true);
    } else {
      setCurrentCheck({
        partnerId: partnerId,
        checkDate: new Date(),
        checkedBy: '',
        checkMethod: '',
        result: '要確認',
        expiryDate: null,
        documentFile: '',
        remarks: '',
        isCompleted: false
      });
      setIsEditing(false);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCheck({
      ...currentCheck,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setCurrentCheck({
      ...currentCheck,
      [name]: date
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentCheck({
      ...currentCheck,
      [name]: checked
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.patch(`/api/antisocial-checks/${currentCheck.id}`, currentCheck);
      } else {
        await axios.post('/api/antisocial-checks', currentCheck);
      }
      fetchChecks();
      fetchPartner();
      handleCloseDialog();
    } catch (error) {
      console.error('反社チェック情報の保存に失敗しました', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('このチェック記録を削除してもよろしいですか？')) {
      try {
        await axios.delete(`/api/antisocial-checks/${id}`);
        fetchChecks();
        fetchPartner();
      } catch (error) {
        console.error('反社チェック情報の削除に失敗しました', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        反社チェック管理
      </Typography>
      
      {partner && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6">
            {partner.name}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>ステータス:</strong> {partner.status}
              </Typography>
              <Typography>
                <strong>反社チェック完了:</strong> {partner.antisocialCheckCompleted ? '完了' : '未完了'}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>最終チェック日:</strong> {partner.antisocialCheckDate ? format(new Date(partner.antisocialCheckDate), 'yyyy年MM月dd日') : '未実施'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpenDialog()}
        >
          新規チェック登録
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>チェック日</TableCell>
              <TableCell>担当者</TableCell>
              <TableCell>チェック方法</TableCell>
              <TableCell>結果</TableCell>
              <TableCell>有効期限</TableCell>
              <TableCell>完了</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {checks.length > 0 ? (
              checks.map((check) => (
                <TableRow key={check.id}>
                  <TableCell>{format(new Date(check.checkDate), 'yyyy/MM/dd')}</TableCell>
                  <TableCell>{check.checkedBy}</TableCell>
                  <TableCell>{check.checkMethod}</TableCell>
                  <TableCell>{check.result}</TableCell>
                  <TableCell>
                    {check.expiryDate ? format(new Date(check.expiryDate), 'yyyy/MM/dd') : '-'}
                  </TableCell>
                  <TableCell>{check.isCompleted ? '完了' : '未完了'}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => handleOpenDialog(check)}
                      sx={{ mr: 1 }}
                    >
                      編集
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(check.id)}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  チェック記録がありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? '反社チェック情報編集' : '新規反社チェック登録'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="チェック日"
                  value={currentCheck.checkDate}
                  onChange={(date) => handleDateChange('checkDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="checkedBy"
                  label="担当者"
                  value={currentCheck.checkedBy}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="checkMethod"
                  label="チェック方法"
                  value={currentCheck.checkMethod}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="例: 日経テレコン、帝国データバンク"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>結果</InputLabel>
                  <Select
                    name="result"
                    value={currentCheck.result}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="問題なし">問題なし</MenuItem>
                    <MenuItem value="要確認">要確認</MenuItem>
                    <MenuItem value="NG">NG</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="有効期限"
                  value={currentCheck.expiryDate}
                  onChange={(date) => handleDateChange('expiryDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="documentFile"
                  label="資料ファイル"
                  value={currentCheck.documentFile}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="ファイルパスまたはURL"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="remarks"
                  label="備考"
                  value={currentCheck.remarks}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <label>
                    <input
                      type="checkbox"
                      name="isCompleted"
                      checked={currentCheck.isCompleted}
                      onChange={handleCheckboxChange}
                    />
                    チェック完了としてマーク（パートナー情報に反映されます）
                  </label>
                </FormControl>
              </Grid>
            </Grid>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>キャンセル</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AntisocialCheckList;
