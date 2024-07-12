// src/App.js
import React, {useEffect, useState} from 'react';
import { Badge, Tabs } from '@mantine/core';
import { OutTable, ExcelRenderer} from 'react-excel-renderer';
import { getLandfills, gasWellsByLandfillsID, listServiceTypes, devicesByLandfillsID, servicesByDevicesID } from './graphql/queries';
import { generateClient } from 'aws-amplify/api';

const Inventory = () => {
  const [rows, setRows] = useState([]);
  const [cols, setCols] = useState([]);
  const [gasWells, setGasWells] = useState([]);

  const client = generateClient();
const landfillId = '6a97337b-29b8-4158-84af-b3ba44d3c7ca';

  const handleFile = (event) => {
    
  
    let fileObj = event.target.files[0];

    ExcelRenderer(fileObj, async (err, resp) => {
      if (err) {
        console.log(err);            
      } else {
        console.log(resp)
        console.log(resp.rows[0].indexOf('gasWellName'))
        const gasWellNameIndex = resp.rows[0].indexOf('gasWellName');

        if(gasWellNameIndex > -1){

          

          setCols(resp.cols);
          setRows(resp.rows);

        } else {
          setCols([{name: "Can't find the proper columns!", key: 0}]);
          setRows([]);
        }
        
      }
    });
  };
useEffect(() => {
  const fetchGasWells = async () => {
    try {
      const gasWellsData = await client.graphql({
          query: gasWellsByLandfillsID,
          variables: { landfillsID: landfillId }
      });
      console.log("GasWells",gasWellsData.data.gasWellsByLandfillsID.items)


      const justGasWellNames = gasWellsData.data.gasWellsByLandfillsID.items.map(gasWel => gasWel.gasWellName);
      console.log(justGasWellNames)

      setGasWells(gasWellsData.data.gasWellsByLandfillsID.items);
    } catch (error) {
      console.error('Error fetching gaswells:', error);
    }
  };


  fetchGasWells();
}, [])
  

  // const queryDatabase = async (columnValue) => {
  //   try {
  //     const response = await client.graphql({
  //       query: gasWellsByLandfillsID,
  //       variables: { landfillsID: 7 }
  //   });
  //     return response.data.getItem;
  //   } catch (error) {
  //     console.error('Error querying database:', error);
  //     return null;
  //   }
  // };

  return (
    <div style={{padding: "0.75rem"}}>
        <h3>Inventory</h3>
        <Tabs defaultValue="sell">
          <Tabs.List>
            <Tabs.Tab value="sell">
              Sell
            </Tabs.Tab>
            <Tabs.Tab value="make">
              Make
            </Tabs.Tab>
            <Tabs.Tab value="buy">
              Buy
            </Tabs.Tab>
            <Tabs.Tab value="stock">
              Stock
            </Tabs.Tab>
            <Tabs.Tab value="items">
              Items
            </Tabs.Tab>
            <Tabs.Tab value="technician_orders">
              Technician Orders <Badge color="blue" size="lg" circle>10</Badge>
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="sell">
          <div>
      <input 
        type="file"
        onChange={handleFile}
        style={{ padding: '10px' }}
      />
     
      <table>
        <thead>
          <tr>
            {cols.map((col, index) => (
              <th key={index}>{col.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>

          </Tabs.Panel>

          <Tabs.Panel value="make">
            Messages tab content
          </Tabs.Panel>

          <Tabs.Panel value="buy">
            Settings tab content
          </Tabs.Panel>

          <Tabs.Panel value="stock">
            Gallery tab content
          </Tabs.Panel>

          <Tabs.Panel value="items">
            Messages tab content
          </Tabs.Panel>

          <Tabs.Panel value="technician_orders">
            Settings tab content
          </Tabs.Panel>
        </Tabs>
    </div>
    
  );
};

export default Inventory;
