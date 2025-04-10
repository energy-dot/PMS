import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import AntisocialCheckList from './AntisocialCheckList';
import BaseContractList from './BaseContractList';
import ContactPersonList from './ContactPersonList';
import { Button, Box } from '@mui/material';

const PartnerDetail = ({ partner, onUpdate }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mb: 2 }}>
        <Button 
          component={Link} 
          to={`/partners/${partner.id}/antisocial-checks`}
          variant="contained" 
          color="primary"
        >
          反社チェック管理
        </Button>
        <Button 
          component={Link} 
          to={`/partners/${partner.id}/base-contracts`}
          variant="contained" 
          color="primary"
        >
          基本契約管理
        </Button>
        <Button 
          component={Link} 
          to={`/partners/${partner.id}/contact-persons`}
          variant="contained" 
          color="primary"
        >
          営業窓口管理
        </Button>
      </Box>

      <Routes>
        <Route path="antisocial-checks" element={<AntisocialCheckList />} />
        <Route path="base-contracts" element={<BaseContractList />} />
        <Route path="contact-persons" element={<ContactPersonList />} />
      </Routes>
    </Box>
  );
};

export default PartnerDetail;
