import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabList from '@mui/lab/TabList';
import { DataGrid } from '@mui/x-data-grid';
import { useTheme } from '@mui/material/styles';
import { DistData2005, DistData20122010, DistData2017, ResData2005, ResData201720122010,
   columnDefs201220102005, columnDefs2017, columnDefsRes2005, columnDefsRes201720122010 } from './SpecData';
   import {TabPanel, a11yProps, TabPanelProps} from './TabTools';



export default function SpecTable() {


  const theme = useTheme();

  const [ISOTab, setISOTab] = React.useState<number>(0);
  const [DistResTab, setDistResTab] = React.useState<number>(0);  
   
  const handleChangeISO = (event: React.SyntheticEvent, newValue: number) => {
    setISOTab(newValue);
  };
  
  const handleChangeDistRes = (event: React.SyntheticEvent, newValue: number) => {
    setDistResTab(newValue);
  };


  // tabs from https://mui.com/material-ui/react-tabs/
  // DataGrid from https://mui.com/material-ui/react-table/
  return (
    <div>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
    <Tabs value={DistResTab} onChange={handleChangeDistRes} aria-label="Distillate and Residuals Tabs" variant="scrollable">
      <Tab label="RESIDUAL FUELS" {...a11yProps(0)} />
      <Tab label="DISTILLATE FUELS" {...a11yProps(1)} />
    </Tabs>
  </Box>
    <TabPanel value={DistResTab} index={0} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={ISOTab} onChange={handleChangeISO} aria-label="ISO spec tabs" variant="scrollable">
          <Tab label="ISO 8217:2017"  {...a11yProps(0)}/>
          <Tab label="ISO 8217:2012"  {...a11yProps(1)}/>
          <Tab label="ISO 8217:2010"  {...a11yProps(2)}/>
          <Tab label="ISO 8217:2005"  {...a11yProps(3)}/>
        </Tabs>
      </Box>
      <TabPanel value={ISOTab} index={0} >
            <div className='mx-auto'  style={{maxWidth: 1300, height: 950, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData201720122010}
                      columns = {columnDefsRes201720122010} 
                  />
            </div>
          </TabPanel>
          <TabPanel value={ISOTab} index={1} >
            <div className='mx-auto'  style={{maxWidth: 1200, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData201720122010}
                      columns = {columnDefsRes201720122010} 
                  />
            </div>
          </TabPanel>
          <TabPanel value={ISOTab} index={2} >
            <div className='mx-auto'  style={{maxWidth: 1200, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData201720122010}
                      columns = {columnDefsRes201720122010} 
                  />
            </div>
          </TabPanel>
          <TabPanel value={ISOTab} index={3} >
            <div className='mx-auto'  style={{maxWidth: 1200, height: 842, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {ResData2005}
                      columns = {columnDefsRes2005} 
                  />
            </div>
          </TabPanel>
    </TabPanel>

    <TabPanel value={DistResTab} index={1} >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={ISOTab} onChange={handleChangeISO} aria-label="ISO spec tabs" variant="scrollable">
          <Tab label="ISO 8217:2017"  {...a11yProps(0)}/>
          <Tab label="ISO 8217:2012"  {...a11yProps(1)}/>
          <Tab label="ISO 8217:2010"  {...a11yProps(2)}/>
          <Tab label="ISO 8217:2005"  {...a11yProps(3)}/>
        </Tabs>
      </Box>
          <TabPanel value={ISOTab} index={0} >
            <div className='mx-auto'  style={{maxWidth: 1010, height: 950, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData2017}
                      columns = {columnDefs2017} 
                  />
            </div>
          </TabPanel>
          <TabPanel value={ISOTab} index={1} >
            <div className='mx-auto'  style={{maxWidth: 800, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData20122010}
                      columns = {columnDefs201220102005} 
                  />
            </div>
          </TabPanel>
          <TabPanel value={ISOTab} index={2} >
            <div className='mx-auto'  style={{maxWidth: 800, height: 805, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData20122010}
                      columns = {columnDefs201220102005} 
                  />
            </div>
          </TabPanel>
          <TabPanel value={ISOTab} index={3} >
            <div className='mx-auto'  style={{maxWidth: 800, height: 842, paddingTop: 40, paddingBottom: 40}}>
              <DataGrid sx={{background: theme.palette.background.paper}}
                      density='compact'
                      hideFooter={true}
                      rows = {DistData2005}
                      columns = {columnDefs201220102005} 
                  />
            </div>
          </TabPanel>
    </TabPanel>
    </div>
  );
}