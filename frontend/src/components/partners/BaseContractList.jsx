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
  Grid,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import ja from 'date-fns/locale/ja';
import { format } from 'date-fns';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BaseContractList = () => {
  const { partnerId } = useParams();
  const [contracts, setContracts] = useState([]);
  const [partner, setPartner] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContract, setCurrentContract] = useState({
    partnerId: partnerId,
    name: '',
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    status: '有効',
    contractType: '',
    contractFile: '',
    terms: '',
    isAutoRenew: false,
    renewalNoticeDate: null,
    remarks: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPartner();
    fetchContracts();
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      const response = await axios.get(`/api/partners/${partnerId}`);
      setPartner(response.data);
    } catch (error) {
      console.error('パートナー情報の取得に失敗しました', error);
    }
  };

  const fetchContracts = async () => {
    try {
      const response = await axios.get(`/api/base-contracts/partner/${partnerId}`);
      setContracts(response.data);
    } catch (error) {
      console.error('基本契約情報の取得に失敗しました', error);
    }
  };

  const handleOpenDialog = (contract = null) => {
    if (contract) {
      setCurrentContract({
        ...contract,
        startDate: new Date(contract.startDate),
        endDate: new Date(contract.endDate),
        renewalNoticeDate: contract.renewalNoticeDate ? new Date(contract.renewalNoticeDate) : null
      });
      setIsEditing(true);
    } else {
      setCurrentContract({
        partnerId: partnerId,
        name: '',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        status: '有効',
        contractType: '',
        contractFile: '',
        terms: '',
        isAutoRenew: false,
        renewalNoticeDate: null,
        remarks: ''
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
    setCurrentContract({
      ...currentContract,
      [name]: value
    });
  };

  const handleDateChange = (name, date) => {
    setCurrentContract({
      ...currentContract,
      [name]: date
    });
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setCurrentContract({
      ...currentContract,
      [name]: checked
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.patch(`/api/base-contracts/${currentContract.id}`, currentContract);
      } else {
        await axios.post('/api/base-contracts', currentContract);
      }
      fetchContracts();
      handleCloseDialog();
    } catch (error) {
      console.error('基本契約情報の保存に失敗しました', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この契約を削除してもよろしいですか？')) {
      try {
        await axios.delete(`/api/base-contracts/${id}`);
        fetchContracts();
      } catch (error) {
        console.error('基本契約情報の削除に失敗しました', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        基本契約管理
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
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography>
                <strong>住所:</strong> {partner.address}
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
          新規契約登録
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>契約名</TableCell>
              <TableCell>契約期間</TableCell>
              <TableCell>ステータス</TableCell>
              <TableCell>契約種別</TableCell>
              <TableCell>自動更新</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.length > 0 ? (
              contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell>{contract.name}</TableCell>
                  <TableCell>
                    {format(new Date(contract.startDate), 'yyyy/MM/dd')} 〜 {format(new Date(contract.endDate), 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell>{contract.status}</TableCell>
                  <TableCell>{contract.contractType || '-'}</TableCell>
                  <TableCell>{contract.isAutoRenew ? 'あり' : 'なし'}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => handleOpenDialog(contract)}
                      sx={{ mr: 1 }}
                    >
                      編集
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(contract.id)}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  契約情報がありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? '基本契約情報編集' : '新規基本契約登録'}
        </DialogTitle>
        <DialogContent>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField
                  name="name"
                  label="契約名"
                  value={currentContract.name}
                  onChange={handleInputChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="契約開始日"
                  value={currentContract.startDate}
                  onChange={(date) => handleDateChange('startDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="契約終了日"
                  value={currentContract.endDate}
                  onChange={(date) => handleDateChange('endDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth required />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>ステータス</InputLabel>
                  <Select
                    name="status"
                    value={currentContract.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="有効">有効</MenuItem>
                    <MenuItem value="更新待ち">更新待ち</MenuItem>
                    <MenuItem value="終了">終了</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  name="contractType"
                  label="契約種別"
                  value={currentContract.contractType}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="例: 基本契約、業務委託契約"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="contractFile"
                  label="契約書ファイル"
                  value={currentContract.contractFile}
                  onChange={handleInputChange}
                  fullWidth
                  placeholder="ファイルパスまたはURL"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="terms"
                  label="契約条件"
                  value={currentContract.terms}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="isAutoRenew"
                      checked={currentContract.isAutoRenew}
                      onChange={handleCheckboxChange}
                    />
                  }
                  label="自動更新"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DatePicker
                  label="更新通知日"
                  value={currentContract.renewalNoticeDate}
                  onChange={(date) => handleDateChange('renewalNoticeDate', date)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="remarks"
                  label="備考"
                  value={currentContract.remarks}
                  onChange={handleInputChange}
                  fullWidth
                  multiline
                  rows={3}
                />
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

export default BaseContractList;
