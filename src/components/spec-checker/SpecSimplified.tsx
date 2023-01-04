import * as React from 'react';
import {Box, Tab, Tabs} from '@mui/material';
import { ResTable2005, ResTable201720122010, DistTable201220102005, DistTable2017, DistData2005, 
  DistData20122010, DistData2017, ResData2005, ResData201720122010} from './SpecData';
import {TabPanel, a11yProps} from './TabTools';



export default function SpecSimplified() {
  const [ISOTab, setISOTab] = React.useState<number>(0);
  const [TypeTab, setTypeTab] = React.useState<number>(0);
  const [DistResTab, setDistResTab] = React.useState<number>(0);  
   
  const handleChangeISO = (event: React.SyntheticEvent, newValue: number) => {
    setISOTab(newValue);
  };

  const handleChangeType = (event: React.SyntheticEvent, newValue: number) => {
    setTypeTab(newValue);
  };

  
  const handleChangeDistRes = (event: React.SyntheticEvent, newValue: number) => {
    setDistResTab(newValue);
  };

  // https://mui.com/material-ui/react-tabs/
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
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel Type tabs" variant="scrollable">
                <Tab label="RMG380 (for typical VSLFO spec)" {...a11yProps(0)}/>
                <Tab label="RMG180" {...a11yProps(1)} />
                <Tab label="RMG500" {...a11yProps(2)} />
                <Tab label="RMG700" {...a11yProps(3)} />
                <Tab label="RMK380" {...a11yProps(4)} />
                <Tab label="RMK500" {...a11yProps(5)} />
                <Tab label="RMK700" {...a11yProps(6)} />
                <Tab label="RMA10" {...a11yProps(7)} />
                <Tab label="RMB30" {...a11yProps(8)} />
                <Tab label="RMD80" {...a11yProps(9)} />
                <Tab label="RME180" {...a11yProps(10)} />
              </Tabs>
            </Box>
            <TabPanel value={TypeTab} index={0} ><ResTable201720122010 rows={ResData201720122010} type={'RMG380'} /></TabPanel>
            <TabPanel value={TypeTab} index={1} ><ResTable201720122010 rows={ResData201720122010} type={'RMG180'} /></TabPanel>
            <TabPanel value={TypeTab} index={2} ><ResTable201720122010 rows={ResData201720122010} type={'RMG500'} /></TabPanel>
            <TabPanel value={TypeTab} index={3} ><ResTable201720122010 rows={ResData201720122010} type={'RMG700'} /></TabPanel>
            <TabPanel value={TypeTab} index={4} ><ResTable201720122010 rows={ResData201720122010} type={'RMK380'} /></TabPanel>
            <TabPanel value={TypeTab} index={5} ><ResTable201720122010 rows={ResData201720122010} type={'RMK500'} /></TabPanel>
            <TabPanel value={TypeTab} index={6} ><ResTable201720122010 rows={ResData201720122010} type={'RMK700'} /></TabPanel>
            <TabPanel value={TypeTab} index={7} ><ResTable201720122010 rows={ResData201720122010} type={'RMA10'} /></TabPanel>
            <TabPanel value={TypeTab} index={8} ><ResTable201720122010 rows={ResData201720122010} type={'RMB30'} /></TabPanel>
            <TabPanel value={TypeTab} index={9} ><ResTable201720122010 rows={ResData201720122010} type={'RMD80'} /></TabPanel>
            <TabPanel value={TypeTab} index={10} ><ResTable201720122010 rows={ResData201720122010} type={'RME180'} /></TabPanel>
      
      </TabPanel>
      <TabPanel value={ISOTab} index={1}  >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={TypeTab} onChange={handleChangeType} aria-label="lab API tabs example" variant="scrollable">
                <Tab label="RMG380 (for typical VSLFO spec)" {...a11yProps(0)}/>
                <Tab label="RMG180" {...a11yProps(1)} />
                <Tab label="RMG500" {...a11yProps(2)} />
                <Tab label="RMG700" {...a11yProps(3)} />
                <Tab label="RMK380" {...a11yProps(4)} />
                <Tab label="RMK500" {...a11yProps(5)} />
                <Tab label="RMK700" {...a11yProps(6)} />
                <Tab label="RMA10" {...a11yProps(7)} />
                <Tab label="RMB30" {...a11yProps(8)} />
                <Tab label="RMD80" {...a11yProps(9)} />
                <Tab label="RME180" {...a11yProps(10)} />
              </Tabs>
            </Box>
            <TabPanel value={TypeTab} index={0} ><ResTable201720122010 rows={ResData201720122010} type={'RMG380'} /></TabPanel>
            <TabPanel value={TypeTab} index={1} ><ResTable201720122010 rows={ResData201720122010} type={'RMG180'} /></TabPanel>
            <TabPanel value={TypeTab} index={2} ><ResTable201720122010 rows={ResData201720122010} type={'RMG500'} /></TabPanel>
            <TabPanel value={TypeTab} index={3} ><ResTable201720122010 rows={ResData201720122010} type={'RMG700'} /></TabPanel>
            <TabPanel value={TypeTab} index={4} ><ResTable201720122010 rows={ResData201720122010} type={'RMK380'} /></TabPanel>
            <TabPanel value={TypeTab} index={5} ><ResTable201720122010 rows={ResData201720122010} type={'RMK500'} /></TabPanel>
            <TabPanel value={TypeTab} index={6} ><ResTable201720122010 rows={ResData201720122010} type={'RMK700'} /></TabPanel>
            <TabPanel value={TypeTab} index={7} ><ResTable201720122010 rows={ResData201720122010} type={'RMA10'} /></TabPanel>
            <TabPanel value={TypeTab} index={8} ><ResTable201720122010 rows={ResData201720122010} type={'RMB30'} /></TabPanel>
            <TabPanel value={TypeTab} index={9} ><ResTable201720122010 rows={ResData201720122010} type={'RMD80'} /></TabPanel>
            <TabPanel value={TypeTab} index={10} ><ResTable201720122010 rows={ResData201720122010} type={'RME180'} /></TabPanel>
      
      </TabPanel>
      <TabPanel value={ISOTab} index={2} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel Type tabs" variant="scrollable">
            <Tab label="RMG380 (for typical VSLFO spec)" {...a11yProps(0)}/>
            <Tab label="RMG180" {...a11yProps(1)} />
            <Tab label="RMG500" {...a11yProps(2)} />
            <Tab label="RMG700" {...a11yProps(3)} />
            <Tab label="RMK380" {...a11yProps(4)} />
            <Tab label="RMK500" {...a11yProps(5)} />
            <Tab label="RMK700" {...a11yProps(6)} />
            <Tab label="RMA10" {...a11yProps(7)} />
            <Tab label="RMB30" {...a11yProps(8)} />
            <Tab label="RMD80" {...a11yProps(9)} />
            <Tab label="RME180" {...a11yProps(10)} />
          </Tabs>
        </Box>
        <TabPanel value={TypeTab} index={0} ><ResTable201720122010 rows={ResData201720122010} type={'RMG380'} /></TabPanel>
        <TabPanel value={TypeTab} index={1} ><ResTable201720122010 rows={ResData201720122010} type={'RMG180'} /></TabPanel>
        <TabPanel value={TypeTab} index={2} ><ResTable201720122010 rows={ResData201720122010} type={'RMG500'} /></TabPanel>
        <TabPanel value={TypeTab} index={3} ><ResTable201720122010 rows={ResData201720122010} type={'RMG700'} /></TabPanel>
        <TabPanel value={TypeTab} index={4} ><ResTable201720122010 rows={ResData201720122010} type={'RMK380'} /></TabPanel>
        <TabPanel value={TypeTab} index={5} ><ResTable201720122010 rows={ResData201720122010} type={'RMK500'} /></TabPanel>
        <TabPanel value={TypeTab} index={6} ><ResTable201720122010 rows={ResData201720122010} type={'RMK700'} /></TabPanel>
        <TabPanel value={TypeTab} index={7} ><ResTable201720122010 rows={ResData201720122010} type={'RMA10'} /></TabPanel>
        <TabPanel value={TypeTab} index={8} ><ResTable201720122010 rows={ResData201720122010} type={'RMB30'} /></TabPanel>
        <TabPanel value={TypeTab} index={9} ><ResTable201720122010 rows={ResData201720122010} type={'RMD80'} /></TabPanel>
        <TabPanel value={TypeTab} index={10} ><ResTable201720122010 rows={ResData201720122010} type={'RME180'} /></TabPanel>
      </TabPanel>
      <TabPanel value={ISOTab} index={3} >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel type tabs" variant="scrollable">
                <Tab label="RMG380 (for typical VSLFO spec)" {...a11yProps(0)} />
                <Tab label="RMH380" {...a11yProps(1)} />
                <Tab label="RMK380" {...a11yProps(2)} />
                <Tab label="RMH700" {...a11yProps(3)} />
                <Tab label="RMK700" {...a11yProps(4)} />
                <Tab label="RME180" {...a11yProps(5)} />
                <Tab label="RMF180" {...a11yProps(6)} />
                <Tab label="RMA30" {...a11yProps(7)} />
                <Tab label="RMB30" {...a11yProps(8)} />
                <Tab label="RMD80" {...a11yProps(9)} />
              </Tabs>
            </Box>
            <TabPanel value={TypeTab} index={0} ><ResTable2005 rows={ResData2005} type={'RMG380'} /></TabPanel>
            <TabPanel value={TypeTab} index={1} ><ResTable2005 rows={ResData2005} type={'RMH380'} /></TabPanel>
            <TabPanel value={TypeTab} index={2} ><ResTable2005 rows={ResData2005} type={'RMK380'} /></TabPanel>
            <TabPanel value={TypeTab} index={3} ><ResTable2005 rows={ResData2005} type={'RMH700'} /></TabPanel>
            <TabPanel value={TypeTab} index={4} ><ResTable2005 rows={ResData2005} type={'RMK700'} /></TabPanel>
            <TabPanel value={TypeTab} index={5} ><ResTable2005 rows={ResData2005} type={'RME180'} /></TabPanel>
            <TabPanel value={TypeTab} index={6} ><ResTable2005 rows={ResData2005} type={'RMF180'} /></TabPanel>
            <TabPanel value={TypeTab} index={7} ><ResTable2005 rows={ResData2005} type={'RMA30'} /></TabPanel>
            <TabPanel value={TypeTab} index={8} ><ResTable2005 rows={ResData2005} type={'RMB30'} /></TabPanel>
            <TabPanel value={TypeTab} index={9} ><ResTable2005 rows={ResData2005} type={'RMD80'} /></TabPanel>
        </TabPanel>
    </TabPanel>
  <TabPanel value={DistResTab} index={1} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={ISOTab} onChange={handleChangeISO} aria-label="ISO tabs" variant="scrollable">
            <Tab label="ISO 8217:2017" {...a11yProps(0)} />
            <Tab label="ISO 8217:2012" {...a11yProps(1)}  />
            <Tab label="ISO 8217:2010" {...a11yProps(2)}  />
            <Tab label="ISO 8217:2005" {...a11yProps(3)}  />
          </Tabs>
        </Box>
        <TabPanel value={ISOTab} index={0} >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel Type tabs" variant="scrollable">
              <Tab label="DMA (for typical MGO, LSMGO spec)" {...a11yProps(0)} />
              <Tab label="DMX" {...a11yProps(1)} />
              <Tab label="DFA" {...a11yProps(2)} />
              <Tab label="DMZ" {...a11yProps(3)} />
              <Tab label="DFZ" {...a11yProps(4)} />
              <Tab label="DMB" {...a11yProps(5)} />
              <Tab label="DFB" {...a11yProps(6)} />
            </Tabs>
          </Box>
          <TabPanel value={TypeTab} index={0} ><DistTable2017 rows={DistData2017} type={'DMA'} /></TabPanel>
          <TabPanel value={TypeTab} index={1} ><DistTable2017 rows={DistData2017} type={'DMX'} /></TabPanel>
          <TabPanel value={TypeTab} index={2} ><DistTable2017 rows={DistData2017} type={'DFA'} /></TabPanel>
          <TabPanel value={TypeTab} index={3} ><DistTable2017 rows={DistData2017} type={'DMZ'} /></TabPanel>
          <TabPanel value={TypeTab} index={4} ><DistTable2017 rows={DistData2017} type={'DFZ'} /></TabPanel>
          <TabPanel value={TypeTab} index={5} ><DistTable2017 rows={DistData2017} type={'DMB'} /></TabPanel>
          <TabPanel value={TypeTab} index={6} ><DistTable2017 rows={DistData2017} type={'DFB'} /></TabPanel>
        </TabPanel>
        <TabPanel value={ISOTab} index={1}  >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel Type tabs" variant="scrollable">
              <Tab label="DMA (for typical MGO, LSMGO spec)" {...a11yProps(0)} />
              <Tab label="DMX" {...a11yProps(1)} />
              <Tab label="DMZ" {...a11yProps(2)} />
              <Tab label="DMB" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={TypeTab} index={0} ><DistTable201220102005 rows={DistData20122010} type={'DMA'} /></TabPanel>
          <TabPanel value={TypeTab} index={1} ><DistTable201220102005 rows={DistData20122010} type={'DMX'} /></TabPanel>
          <TabPanel value={TypeTab} index={2} ><DistTable201220102005 rows={DistData20122010} type={'DMZ'} /></TabPanel>
          <TabPanel value={TypeTab} index={3} ><DistTable201220102005 rows={DistData20122010} type={'DMB'} /></TabPanel>
        </TabPanel>
        <TabPanel value={ISOTab} index={2}  >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel Type tabs" variant="scrollable">
              <Tab label="DMA (for typical MGO, LSMGO spec)" {...a11yProps(0)} />
              <Tab label="DMX" {...a11yProps(1)} />
              <Tab label="DMZ" {...a11yProps(2)} />
              <Tab label="DMB" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={TypeTab} index={0} ><DistTable201220102005 rows={DistData20122010} type={'DMA'} /></TabPanel>
          <TabPanel value={TypeTab} index={1} ><DistTable201220102005 rows={DistData20122010} type={'DMX'} /></TabPanel>
          <TabPanel value={TypeTab} index={2} ><DistTable201220102005 rows={DistData20122010} type={'DMZ'} /></TabPanel>
          <TabPanel value={TypeTab} index={3} ><DistTable201220102005 rows={DistData20122010} type={'DMB'} /></TabPanel>
        </TabPanel>
        <TabPanel value={ISOTab} index={3} >
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={TypeTab} onChange={handleChangeType} aria-label="Fuel Type tabs" variant="scrollable">
              <Tab label="DMA (for typical MGO, LSMGO spec)" {...a11yProps(0)} />
              <Tab label="DMX" {...a11yProps(1)} />
              <Tab label="DMZ" {...a11yProps(2)} />
              <Tab label="DMB" {...a11yProps(3)} />
            </Tabs>
          </Box>
          <TabPanel value={TypeTab} index={0} ><DistTable201220102005 rows={DistData2005} type={'DMA'} /></TabPanel>
          <TabPanel value={TypeTab} index={1} ><DistTable201220102005 rows={DistData2005} type={'DMX'} /></TabPanel>
          <TabPanel value={TypeTab} index={2} ><DistTable201220102005 rows={DistData2005} type={'DMZ'} /></TabPanel>
          <TabPanel value={TypeTab} index={3} ><DistTable201220102005 rows={DistData2005} type={'DMB'} /></TabPanel>
        </TabPanel>
    </TabPanel>
    </div>
  );
}