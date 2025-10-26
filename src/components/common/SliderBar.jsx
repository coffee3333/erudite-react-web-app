import {Container, Stack, Slider} from "@mui/material";
import VolumeDown from '@mui/icons-material/VolumeDown';
import VolumeUp from '@mui/icons-material/VolumeUp';

export default function SliderBar() {


    return (
        <Container sx={{ bgcolor: "primary.main", color: "white" }}>
            <Stack spacing={2} direction="row" sx={{ alignItems: 'center', mb: 1 }}>
                <VolumeDown />
                <Slider aria-label="Volume" onChange={() => console.log("Niki is bad")} sx={{ color: "red",  }} />
                <VolumeUp />
            </Stack>
            <Slider disabled defaultValue={30} aria-label="Disabled slider" />
        </Container>
    )
}