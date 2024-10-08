import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './SeatSelection.css';
import seatNormal from '../../assets/seats/ghe-thuong.png';
import seatVIP from '../../assets/seats/ghe-vip.png';
import seatSelected from '../../assets/seats/ghe-da-chon.png';
import seatCouple from '../../assets/seats/ghe-doi.png';
import seatSold from '../../assets/seats/ghe-da-ban.png';
import seatMapHeader from '../../assets/seats/seatMapHeader.png';
import seatCoupleSelected from '../../assets/seats/ghe-doi-da-chon.png';
import axios from 'axios';
import OrderTicket from '../../modules/orders/OrderTicket';

const SeatSelection = () => {
    const { showtimeId } = useParams();
    const navigate = useNavigate();
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [seatLayout, setSeatLayout] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showtimeDetails, setShowtimeDetails] = useState(null);



    // Fetch seat layout and showtime details based on showtimeId
    useEffect(() => {
        const fetchSeatsAndShowtimeDetails = async () => {
            try {
                // Fetch seat data using axios
                const seatResponse = await axios.get(`http://localhost:8080/seats?showtimeId=${showtimeId}`);
                const seatData = seatResponse.data;
                if (seatData?.data) {

                    const allSeats = seatData.data.slice(0, 60);

                    const seatNormal = allSeats.filter(seats => seats.seatType.seatTypeName === 'Ghế thường');
                    const seatVIP = allSeats.filter(seats => seats.seatType.seatTypeName === 'VIP');
                    const seatCouple = allSeats.filter(seats => seats.seatType.seatTypeName === 'Couple');

                    const arrangedSeats = [
                        ...seatNormal,
                        ...seatVIP.slice(Math.floor(seatVIP.length / 2)),
                        ...seatCouple
                    ];

                    setSeatLayout(arrangedSeats);
                } else {
                    setSeatLayout([]);
                    console.error("No seat data found");
                }

                // Fetch showtime details using axios
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



    // Handle seat selection and deselection
    const handleSeatClick = (seat) => {
        if (seat.booked) {
            alert('This seat has already been sold!');
            return;
        }

        setSelectedSeats((prevSelected) => {
            if (prevSelected.some(selected => selected.seatId === seat.seatId)) {
                // If the seat is already selected, deselect it
                return prevSelected.filter(selected => selected.seatId !== seat.seatId);
            } else {
                // If the seat is not selected, add it to the selection
                return [...prevSelected, seat];
            }
        });
    };

    const goToOrderFood = () => {
        navigate('/orderFood', { state: { selectedSeats, showtimeDetails } });
    };

    // Calculate total price based on ticket price and selected seats' seatTypePrice
    const getTotalPrice = () => {
        if (!showtimeDetails) return 0;
        const ticketPrice = showtimeDetails.showtimePrice;

        return selectedSeats.reduce((total, selectedSeat) => {
            const seat = seatLayout.find(s => s.seatId === selectedSeat.seatId);
            const seatPrice = seat ? seat.seatType.seatTypePrice : 0;
            return total + (ticketPrice + seatPrice);
        }, 0);
    };

    const getGroupedSeatsByType = () => {
        return selectedSeats.reduce((acc, seat) => {
            const type = seat.seatType.seatTypeName;
            if (!acc[type]) {
                acc[type] = [];
            }
            acc[type].push(seat);
            return acc;
        }, {});
    };

    if (loading) {
        return <div>Loading seat data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (

        <Container fluid>
            <OrderTicket />

            <Card.Title className="mx-3" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                BƯỚC 2: CHỌN GHẾ
            </Card.Title>
            <Row className="justify-content-center align-items-stretch">
                <Col xs={12} lg={8} className="seat-selection-column d-flex flex-column">
                    <Col xs={12} lg={12} className="mb-3">
                        <Card.Img src={seatMapHeader} alt="Màn hình" style={{ width: '100%' }} />
                    </Col>

                    <Col>
                        <div className="seat-map flex-grow-1" style={{ overflowY: 'auto', padding: '10px' }}>
                            {seatLayout.length > 0 ? (
                                seatLayout.map((seat, index) => (
                                    <img
                                        key={index}
                                        src={selectedSeats.some(selected => selected.seatId === seat.seatId)
                                            ? seat.seatType.seatTypeName === 'Couple'
                                                ? seatCoupleSelected
                                                : seatSelected
                                            : seat.booked
                                                ? seatSold
                                                : seat.seatType.seatTypeName === 'Ghế thường'
                                                    ? seatNormal
                                                    : seat.seatType.seatTypeName === 'VIP'
                                                        ? seatVIP
                                                        : seatCouple
                                        }
                                        alt={seat.seatType.seatTypeName}
                                        className={`seat ${seat.seatType.seatTypeName}`}
                                        onClick={() => handleSeatClick(seat)}
                                    />
                                ))
                            ) : (
                                <div>Không có ghế nào có sẵn.</div>
                            )}
                        </div>
                    </Col>

                    <div className="seat-legend text-center mt-3">
                        <Row>
                            <Col xs={4}><img src={seatNormal} alt="Ghế thường" /> Ghế thường</Col>
                            <Col xs={4}><img src={seatVIP} alt="Ghế VIP" /> Ghế VIP</Col>
                            <Col xs={4}><img src={seatSelected} alt="Ghế đã chọn" /> Ghế đã chọn</Col>
                            <Col xs={4}><img src={seatSold} alt="Ghế đã bán" /> Ghế đã bán</Col>
                            <Col xs={4}><img src={seatCouple} alt="Ghế đôi" /> Ghế đôi</Col>
                        </Row>
                    </div>
                </Col>

                {/* Pricing Details */}
                <Col xs={12} lg={4} className="pricing-column d-flex flex-column justify-content-between">
                    <div className="pricing-details p-3 rounded shadow-sm bg-white">
                        {showtimeDetails && (
                            <div className="pricing-details">
                                <Card.Title>{showtimeDetails.movieTitle}</Card.Title>

                                <h6 className="text-muted" style={{ fontSize: '1.2rem', fontWeight: 'bold', textAlign: 'left' }}>
                                    {showtimeDetails.screen.cinema.cinemaName}
                                </h6>
                                <p style={{ fontSize: '1rem', textAlign: 'left' }}>
                                    <strong style={{ color: '#5DBB63', fontSize: '1.1rem' }}>{showtimeDetails.screen.screenName}</strong>
                                    {' - '}
                                    {new Date(showtimeDetails.showtimeAt).toLocaleString('en-GB', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        day: '2-digit',
                                        month: '2-digit',
                                        year: 'numeric'
                                    })}
                                </p>
                            </div>
                        )}

                        <div style={{ textAlign: 'left' }}>
                            {Object.entries(getGroupedSeatsByType()).map(([seatType, seats]) => (
                                <div key={seatType}>
                                    <p><strong>{seats.length} x {seatType}</strong></p>
                                    <p>{seats.map(seat => seat.seatName).join(', ')}</p>
                                </div>
                            ))}
                        </div>

                        <hr />
                        <p style={{ textAlign: 'left' }}>Total Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(getTotalPrice())}</p>
                        <Button variant="success" block onClick={goToOrderFood}>
                            CHỌN ĐỒ ĂN (2/4)
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default SeatSelection;
