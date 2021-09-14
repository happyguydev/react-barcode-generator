import React, {useEffect, useState} from "react";
import {
  Grid,
  TextField,
  Button,
  Paper,
  makeStyles,
  createMuiTheme,
  ThemeProvider
} from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import PrintIcon from '@material-ui/icons/Print';
import DateFnsUtils from '@date-io/date-fns';
import '@progress/kendo-ui';
import { savePDF } from "@progress/kendo-react-pdf";
import {Barcode} from "@progress/kendo-barcodes-react-wrapper";

import firebase from "../utils/firebase";
import PrintDocument from "./PrintDocument";

const theme = createMuiTheme({
  palette: {
    primary: { main: '#4caf50', contrastText: '#ffffff' },
  },
});

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    '.k-pdf-export > div': {
      height: '100%',
    }
  },
  container: {
    height: '100vh',
    '& p': {
      textAlign: 'center',
    },
  },
  input: {
    maxWidth: 300,
    margin: '8px auto 0',
    display: 'flex',
  },
  time: {
    '& .MuiFormControl-root': {
      display: 'flex',
      maxWidth: 300,
      margin: '8px auto 0',
    }
  },
  detail: {
    maxWidth: 284,
    margin: '8px auto 0',
    padding: 15,
    '& p': {
      marginTop: 5,
      marginBottom: 0
    },
  },
  preview: {
    margin: '8px auto 0',
    width: 144,
    height: 216,
    '& > div': {
      height: '100%',
    },
  },
  previewItem: {
    fontFamily: 'Open Sans, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 8,
    textAlign: 'center',
    padding: 3,
    width: 144,
    height: 216,
    margin: '0 auto',
  },
  printBtn: {
    display: 'flex',
    width: 192,
    margin: '8px auto 0',
    fontWeight: 'bold',
  },
}));

const database = firebase.database();

const Home = () => {
  const classes = useStyles();

  const [labels, setLabels] = useState([]);
  const [label, setLabel] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [quantity, setQuantity] = useState(1);
  const [arr, setArr] = useState([]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const dbRef = database.ref('labels/');

  const onChangeHandle = (value) => {
    if (!value) {
      setLabels([]);
      return;
    }

    dbRef.on('value', async (snapshot) => {
      const labelList = [];
      snapshot.forEach((data) => {
        let item = data.val();
        if (item['sku'].toString().includes(value)) {
          labelList.push(item);
        }
      });
      setLabels(Object.keys(labelList).map((key) => labelList[key]));
    });
  };

  const container = React.useRef(null);

  const printDocument = () => {
    if (quantity === 0 || Object.keys(label).length === 0) {
      alert('Input quantity or select label.');
      return;
    }
    let element = container.current || document.body;

    savePDF(element, {
      paperSize: ['3in', '2in'],
      margin: 0,
      fileName: `FNSKU Label ${new Date().getMilliseconds()}`,
    });
  }

  useEffect(() => {
    setArr([]);
    for (let i = 0; i < quantity; i++) {
      setArr(prevState => [...prevState, i]);
    }
  }, [quantity])

  return (
    <>
      <div className={classes.root}>
        <div style={{position: 'absolute', left: -10000000, top: -10000000}}>
          <div ref={container}>
            <div>
              {arr.map((item, index) => (
                <PrintDocument key={index} label={label} selectedDate={selectedDate} />
              ))}
            </div>
          </div>
        </div>
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          className={classes.container}
        >
          <Grid xs={12} sm={6} item>
            <Autocomplete
              id="search-sku"
              className={classes.input}
              getOptionSelected={(option, value) => option.sku.toString() === value.sku.toString()}
              onChange={(event, newValue) => {
                if (!newValue) {
                  setLabel({});
                  setLabels([]);
                } else {
                  setLabel(newValue);
                }
              }}
              getOptionLabel={(option) => option.sku.toString()}
              options={labels}
              noOptionsText={'No SKU'}
              renderInput={
                (params) => (
                  <TextField
                    {...params}
                    label="Search (SKU)"
                    variant="outlined"
                    onChange={ev => {
                      if (ev.target.value !== "" || ev.target.value !== null) {
                        onChangeHandle(ev.target.value);
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                    }}
                  />
                )
              }
              renderOption={(option, { inputValue }) => {
                let index = option.sku.toString().toLowerCase().indexOf(inputValue.toLowerCase());

                let length = inputValue.length;

                let prefix = option.sku.toString().substring(0, index);
                let suffix = option.sku.toString().substring(index + length);
                let match = option.sku.toString().substring(index, index + length);

                return (
                  <>
                  <span>
                    {prefix}<span style={{fontWeight: 'bold'}}>{match}</span>{suffix}
                  </span>
                  </>
                );
              }}
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <div className={classes.time}>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  autoOk
                  variant="inline"
                  inputVariant="outlined"
                  label="Expiration Date (Optional)"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  InputAdornmentProps={{ position: "end" }}
                  onChange={date => handleDateChange(date)}
                />
              </MuiPickersUtilsProvider>
            </div>
          </Grid>
          <Grid xs={12} sm={6} item>
            <Paper className={classes.detail} variant="outlined">
              <p>ITEM NAME</p>
              <p>{Object.keys(label).length > 0 && label.item_name}</p>
            </Paper>
          </Grid>
          <Grid xs={12} sm={6} item>
            <Paper className={classes.detail} variant="outlined">
              <p>FNSKU</p>
              <p>{Object.keys(label).length > 0 && label.fnsku}</p>
            </Paper>
          </Grid>
          <Grid xs={12} item>
            <p>Label Preview</p>
            <Paper className={classes.preview} elevation={3} square>
              {Object.keys(label).length > 0 &&
                <div className={classes.previewItem}>
                  <Barcode type={"code128"} width={144} height={50} text={{font: '8px monospace'}} value={label.fnsku}/>
                  <div>{label.item_name}</div>
                  <div>{label.condition}</div>
                  <div>{`BEST BY: ${selectedDate.getMonth() + 1}/${selectedDate.getDate()}/${selectedDate.getFullYear()}`}</div>
                  <div className="separate" style={{border: '1px solid', fontWeight: 'bold', padding: '3px 0', width: '100%'}}>
                    <span>THIS IS A SET - DO NOT SEPARATE</span>
                  </div>
                  <div className="warning" style={{fontSize: 10, width: 129}}>
                    Warning: To avoid the danger of suffocation, keep this plastic bag away from babies and children. Do not use this bag in cribs, beds, carriages, or playpens. This bag is not a toy.
                  </div>
                </div>
              }
            </Paper>
          </Grid>
          <Grid xs={12} sm={6} item>
            <TextField
              id="quantity-to-print"
              label="Quantity to print"
              type="number"
              variant="outlined"
              className={classes.input}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </Grid>
          <Grid xs={12} sm={6} item>
            <ThemeProvider theme={theme}>
              <Button
                variant="contained"
                color="primary"
                size="large"
                className={classes.printBtn}
                startIcon={<PrintIcon />}
                onClick={printDocument}
              >
                PRINT
              </Button>
            </ThemeProvider>
          </Grid>
        </Grid>
      </div>
    </>
  )
}

export default Home;
