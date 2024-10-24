import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import SeatLayout from './SeatLayout';
import './SeatSelection.css';
import PricingDetails from './PricingDetails';
import seatMapHeader from '../../assets/seats/seatMapHeader.png';
import SeatDescription from './SeatDescription';

const SeatSelection = () => {
    const location = useLocation();
    const { showtimeId, movieDetails } = location.state || {};
    console.log( movieDetails);
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatLayout, setSeatLayout] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showtimeDetails, setShowtimeDetails] = useState(null);
    const [movieTitle] = useState(movieDetails?.movieTitle || 'Unknown Movie Title');
    const [moviePosterUrl] = useState(movieDetails?.moviePosterUrl || '');


    useEffect(() => {
        const fetchSeatsAndShowtimeDetails = async () => {
            try {
                const seatResponse = await axios.get(`http://localhost:8080/seats`);
                const seatData = seatResponse.data;
                if (seatData?.data) {
                    const allSeats = seatData.data.slice(0, 60);
                    const seatNormal = allSeats.filter(seat => seat.seatType.seatTypeName === 'Ghế thường');
                    const seatVIP = allSeats.filter(seat => seat.seatType.seatTypeName === 'VIP');
                    const seatCouple = allSeats.filter(seat => seat.seatType.seatTypeName === 'Couple');
                    setSeatLayout([...seatNormal, ...seatVIP, ...seatCouple]);
                } else {
                    setSeatLayout([]);
                    console.error("No seat data found");
                }

                const showtimeResponse = await axios.get(`http://localhost:8080/showtimes/${showtimeId}`);
                const showtimeData = showtimeResponse.data;
                if (showtimeData?.data) {
                    setShowtimeDetails(showtimeData.data);
                } else {
                    setShowtimeDetails(null);
                    console.error("No showtime data found");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Unable to fetch seat or showtime data.");
            } finally {
                setLoading(false);
            }
        };
        fetchSeatsAndShowtimeDetails();
    }, [showtimeId]);

    const handleSeatClick = (seat) => {
        if (seat.booked) {
            alert('This seat has already been sold!');
            return;
        }

        setSelectedSeats((prevSelected) => {
            if (prevSelected.some(selected => selected.seatId === seat.seatId)) {
                return prevSelected.filter(selected => selected.seatId !== seat.seatId);
            } else {
                return [...prevSelected, seat];
            }
        });
    };

    const getTotalPrice = () => {
        if (!showtimeDetails) return 0;
        const ticketPrice = showtimeDetails.showtimePrice;
        return selectedSeats.reduce((total, selectedSeat) => {
            const seat = seatLayout.find(s => s.seatId === selectedSeat.seatId);
            const seatPrice = seat ? seat.seatType.seatTypePrice : 0;
            return total + (ticketPrice + seatPrice);
        }, 0);
    };

    if (loading) {
        return <div>Loading seat data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const goToOrderFood = () => {
        navigate('/order-snacks', { state: { selectedSeats, showtimeDetails, movieDetails } });
    };

    return (
        <Container fluid>
            
            <Card.Title className="text-center mt-4" style={{ fontSize: '1.9rem', fontWeight: 'bold' }}>BƯỚC 2: CHỌN GHẾ</Card.Title>
            {/* <OrderTicket/> */}
            <Row>
                <Col xs={12} lg={8} className="seat-selection-column d-flex flex-column">
                    <Col xs={12} lg={12} className="mb-3">
                        <Card.Img src={seatMapHeader} alt="Màn hình" className="img-fluid" />
                    </Col>
                    <Col>
                        <SeatLayout seatLayout={seatLayout} selectedSeats={selectedSeats} onSeatClick={handleSeatClick} />
                    </Col>
                    <SeatDescription />
                </Col>

                <Col xs={12} lg={4} className="pricing-column d-flex flex-column justify-content-between mt-3 mt-lg-0">
                    <PricingDetails
                        movieTitle={movieTitle}
                        showtimeDetails={showtimeDetails}
                        selectedSeats={selectedSeats}
                        getTotalPrice={getTotalPrice}
                        goToOrderFood={goToOrderFood}
                        moviePosterUrl={moviePosterUrl}
                    />
                </Col>
            </Row>
        </Container>
    );
};

export default SeatSelection;
