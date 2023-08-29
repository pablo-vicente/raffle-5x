import { Box } from "@mui/material";
import { Rank } from "./components/Rank";
import { SortedCuponsList, ISortedCupon } from "./components/SortedCuponsList";


function App() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'space-between', backgroundColor: 'green' }}>
      <SortedCuponsList sotedCupons={sotedCupons} />
      <Rank sotedCupons={sotedCupons} />
    </Box>

  );
}

export default App;
const sotedCupons: ISortedCupon[] = [
  {
    Code: 4000,
    Name: "507 - HERCILIO SCHATZ"
  },
  {
    Code: 4001,
    Name: "602 - LOURENO"
  },
  {
    Code: 4001,
    Name: "507 - HERCILIO SCHATZ"
  },
  {
    Code: 4001,
    Name: "602 - LOURENO"
  },
  {
    Code: 4002,
    Name: "604 - HAGATA"
  },
  {
    Code: 4003,
    Name: "604 - HAGATA"
  },
  {
    Code: 40,
    Name: "507 - HERCILIO SCHATZ"
  },
]
