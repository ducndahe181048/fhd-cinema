import React from 'react';
import Seat from './Seat';

const SeatLayout = ({ seatLayout, selectedSeats, onSeatClick }) => {
    // Group seats by type
    const normalSeats = seatLayout.filter(seat => seat.seatType.seatTypeName === 'Ghế thường');
    let vipSeats = seatLayout.filter(seat => seat.seatType.seatTypeName === 'VIP');
    const coupleSeats = seatLayout.filter(seat => seat.seatType.seatTypeName === 'Couple');

    
    // Split the VIP seats into two groups (rows)
    const vipFirstRow = vipSeats.slice(0, 16);
    const vipSecondRow = vipSeats.slice(16, 35); // First 6 seats for row 1
    // const vipSecondRow = vipSeats.slice(17, 35); // Middle 4 seats (after moving two seats)



    return (
        <div className="fixed-height-container">
            {/* Regular Seats (Single row, no wrapping) */}
            <div className="regular-seats">
                {normalSeats.map((seat, index) => (
                    <Seat
                        key={index}
                        seat={seat}
                        isSelected={selectedSeats.some(selected => selected.seatId === seat.seatId)}
                        onClick={onSeatClick}
                    />
                ))}
            </div>

            {/* VIP Seats - First row */}
            <div className="vip-seats">
                {vipFirstRow.map((seat, index) => (
                    <Seat
                        key={index}
                        seat={seat}
                        isSelected={selectedSeats.some(selected => selected.seatId === seat.seatId)}
                        onClick={onSeatClick}
                    />
                ))}
            </div>

            {/* VIP Seats - Second row */}
            <div className="vip-seats">
                {vipSecondRow.map((seat, index) => (
                    <Seat
                        key={index}
                        seat={seat}
                        isSelected={selectedSeats.some(selected => selected.seatId === seat.seatId)}
                        onClick={onSeatClick}
                    />
                ))}
            </div>

            <div className="couple-seats">
                {coupleSeats.map((seat, index) => (
                    <Seat
                        key={index}
                        seat={seat}
                        isSelected={selectedSeats.some(selected => selected.seatId === seat.seatId)}
                        onClick={onSeatClick}
                    />
                ))}
            </div>
        </div>
    );
};

export default SeatLayout;