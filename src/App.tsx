import './App.css';
import {Container, Typography} from "@mui/material";
import {DataForm} from './components/DataForm/DataForm'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en-gb">
        <Container>
            <div className="title">
                <Typography variant="h4">Сколько дней вы на острове?</Typography>
            </div>
            <DataForm />
        </Container>
    </LocalizationProvider>
  );
}

export default App;
