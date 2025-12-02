import Navbar from "@/components/navbar";
import { Container, Typography} from "@mui/material";

export default function CheckoutPage(){
    return(
        <Container>
            <Typography variant="h4" sx={{ fontWeight: 800, marginBottom: 3, textAlign: "center" }}>
                Checkout
            </Typography>
            <Navbar />
        </Container>
    );
}