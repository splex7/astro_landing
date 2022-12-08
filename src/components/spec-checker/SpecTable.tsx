import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { DistData2005, DistData20122010, DistData2017, ResData2005, ResData201720122010,
   columnDefs201220102005, columnDefs2017, columnDefsRes2005, columnDefsRes201720122010 } from './SpecData';



export default function SpecTable() {


  const [value, setValue] = React.useState('1');
  const [DistResTab, setDistResTab] = React.useState('1');
  const theme = useTheme();

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeDistRes = (event: React.SyntheticEvent, newValue: string) => {
    setDistResTab(newValue);
  };

  // tabs from https://mui.com/material-ui/react-tabs/
  // DataGrid from https://mui.com/material-ui/react-table/
  return (
    <TabContext value= {DistResTab} >
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={handleChangeDistRes} aria-label="lab API tabs example">
        <Tab label="RESIDUAL FUELS" value="1" />
        <Tab label="DISTILLATE FUELS" value="2" />
      </TabList>
    </Box>
      <TabPanel value="1" sx={{padding: 0,}}>
      <Box sx={{ width: '100%', maxWidth: 1120, height: 1030, typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="ISO 8217:2017" value="1" />
              <Tab label="ISO 8217:2012" value="2" />
              <Tab label="ISO 8217:2010" value="3" />
              <Tab label="ISO 8217:2005" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 1300, height: 950, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData201720122010}
                      columns = {columnDefsRes201720122010} 
                  />
            </div>
          </TabPanel>
          <TabPanel value="2" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 1200, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData201720122010}
                      columns = {columnDefsRes201720122010} 
                  />
            </div>
          </TabPanel>
          <TabPanel value="3" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 1200, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData201720122010}
                      columns = {columnDefsRes201720122010} 
                  />
            </div>
          </TabPanel>
          <TabPanel value="4" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 1200, height: 842, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData2005}
                      columns = {columnDefsRes2005} 
                  />
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </TabPanel>

    <TabPanel value="2" sx={{padding: 0,}}>
      <Box sx={{ width: '100%', maxWidth: 1120, height: 1030, typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="ISO 8217:2017" value="1" />
              <Tab label="ISO 8217:2012" value="2" />
              <Tab label="ISO 8217:2010" value="3" />
              <Tab label="ISO 8217:2005" value="4" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 1010, height: 950, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData2017}
                      columns = {columnDefs2017} 
                  />
            </div>
          </TabPanel>
          <TabPanel value="2" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 800, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData20122010}
                      columns = {columnDefs201220102005} 
                  />
            </div>
          </TabPanel>
          <TabPanel value="3" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 800, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData20122010}
                      columns = {columnDefs201220102005} 
                  />
            </div>
          </TabPanel>
          <TabPanel value="4" sx={{padding: 0,}}>
            <div className='mx-auto'  style={{maxWidth: 800, height: 842, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData2005}
                      columns = {columnDefs201220102005} 
                  />
            </div>
          </TabPanel>
        </TabContext>
      </Box>
    </TabPanel>
    </TabContext>
  );
}