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
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ContactPersonList = () => {
  const { partnerId } = useParams();
  const [contactPersons, setContactPersons] = useState([]);
  const [partner, setPartner] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentContactPerson, setCurrentContactPerson] = useState({
    partnerId: partnerId,
    name: '',
    position: '',
    department: '',
    email: '',
    phone: '',
    mobilePhone: '',
    type: '営業担当',
    remarks: '',
    preferredContactMethod: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchPartner();
    fetchContactPersons();
  }, [partnerId]);

  const fetchPartner = async () => {
    try {
      const response = await axios.get(`/api/partners/${partnerId}`);
      setPartner(response.data);
    } catch (error) {
      console.error('パートナー情報の取得に失敗しました', error);
    }
  };

  const fetchContactPersons = async () => {
    try {
      const response = await axios.get(`/api/contact-persons/partner/${partnerId}`);
      setContactPersons(response.data);
    } catch (error) {
      console.error('担当者情報の取得に失敗しました', error);
    }
  };

  const handleOpenDialog = (contactPerson = null) => {
    if (contactPerson) {
      setCurrentContactPerson({
        ...contactPerson
      });
      setIsEditing(true);
    } else {
      setCurrentContactPerson({
        partnerId: partnerId,
        name: '',
        position: '',
        department: '',
        email: '',
        phone: '',
        mobilePhone: '',
        type: '営業担当',
        remarks: '',
        preferredContactMethod: ''
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
    setCurrentContactPerson({
      ...currentContactPerson,
      [name]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (isEditing) {
        await axios.patch(`/api/contact-persons/${currentContactPerson.id}`, currentContactPerson);
      } else {
        await axios.post('/api/contact-persons', currentContactPerson);
      }
      fetchContactPersons();
      handleCloseDialog();
    } catch (error) {
      console.error('担当者情報の保存に失敗しました', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('この担当者を削除してもよろしいですか？')) {
      try {
        await axios.delete(`/api/contact-persons/${id}`);
        fetchContactPersons();
      } catch (error) {
        console.error('担当者情報の削除に失敗しました', error);
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        営業窓口担当者管理
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
                <strong>電話番号:</strong> {partner.phone}
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
          新規担当者登録
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>氏名</TableCell>
              <TableCell>役職</TableCell>
              <TableCell>部署</TableCell>
              <TableCell>担当区分</TableCell>
              <TableCell>メールアドレス</TableCell>
              <TableCell>電話番号</TableCell>
              <TableCell>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contactPersons.length > 0 ? (
              contactPersons.map((contactPerson) => (
                <TableRow key={contactPerson.id}>
                  <TableCell>{contactPerson.name}</TableCell>
                  <TableCell>{contactPerson.position || '-'}</TableCell>
                  <TableCell>{contactPerson.department || '-'}</TableCell>
                  <TableCell>{contactPerson.type}</TableCell>
                  <TableCell>{contactPerson.email || '-'}</TableCell>
                  <TableCell>{contactPerson.phone || contactPerson.mobilePhone || '-'}</TableCell>
                  <TableCell>
                    <Button 
                      size="small" 
                      onClick={() => handleOpenDialog(contactPerson)}
                      sx={{ mr: 1 }}
                    >
                      編集
                    </Button>
                    <Button 
                      size="small" 
                      color="error" 
                      onClick={() => handleDelete(contactPerson.id)}
                    >
                      削除
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  担当者情報がありません
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEditing ? '担当者情報編集' : '新規担当者登録'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                name="name"
                label="氏名"
                value={currentContactPerson.name}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>担当区分</InputLabel>
                <Select
                  name="type"
                  value={currentContactPerson.type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="主要担当">主要担当</MenuItem>
                  <MenuItem value="営業担当">営業担当</MenuItem>
                  <MenuItem value="技術担当">技術担当</MenuItem>
                  <MenuItem value="その他">その他</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="position"
                label="役職"
                value={currentContactPerson.position}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="department"
                label="部署"
                value={currentContactPerson.department}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                label="メールアドレス"
                value={currentContactPerson.email}
                onChange={handleInputChange}
                fullWidth
                type="email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="phone"
                label="電話番号"
                value={currentContactPerson.phone}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="mobilePhone"
                label="携帯電話"
                value={currentContactPerson.mobilePhone}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="preferredContactMethod"
                label="希望連絡方法"
                value={currentContactPerson.preferredContactMethod}
                onChange={handleInputChange}
                fullWidth
                placeholder="例: メール優先、電話優先"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="remarks"
                label="備考"
                value={currentContactPerson.remarks}
                onChange={handleInputChange}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
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

export default ContactPersonList;
