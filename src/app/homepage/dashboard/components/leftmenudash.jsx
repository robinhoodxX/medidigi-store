"use client";

import React from 'react';
import { Box, Typography } from '@mui/material';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import DrugSearchingForum from './drugsearchingforum';
import Wishlists from './wishlists/page';
import Customs from './customs/page';
import Profile from './profile/page';
import { useRouter } from 'next/navigation';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}


export default function leftmenudash() {
  const router = useRouter();

  const [value, setValue] = React.useState(0);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
      <Box
        sx={{ bgcolor: 'background.paper', display: 'flex', width: '100%', height: '100%' }}
      >
        <Tabs
          orientation="vertical"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{ overflow: 'unset', borderRight: 1, borderColor: 'divider', width: '300px' }}
        >
          <Tab label="Search" {...a11yProps(0)} />
          <Tab label="Custom" {...a11yProps(1)} />
          <Tab label="Wishlist" {...a11yProps(2)} />
          <Tab label="Profile" {...a11yProps(3)} />
          <Tab label="Setting" {...a11yProps(4)} />
          <Tab label="Log out" {...a11yProps(5)} onClick={handleLogout} />
          <Tab label="About Us" {...a11yProps(6)} />
        </Tabs>
        <Box sx={{ width: '100%' }}>
          <TabPanel value={value} index={0}>
            <DrugSearchingForum />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Customs />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Wishlists />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Profile />
          </TabPanel>
          <TabPanel value={value} index={4}>
            Item Five
          </TabPanel>
          <TabPanel value={value} index={5}>
            Item Six
          </TabPanel>
          <TabPanel value={value} index={6}>
            About Us: We are a team of passionate developers dedicated to creating a seamless online platform for medicine discovery and healthcare solutions. 
            Our mission is to empower users with accurate information and personalized recommendations to enhance their well-being. With a user-friendly interface and 
            cutting-edge technology, we strive to make healthcare accessible and convenient for everyone.
          </TabPanel>
        </Box>
      </Box>
    </Box>
  )
}