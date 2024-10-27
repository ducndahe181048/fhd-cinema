// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { fetchShowTime } from "../../../../src/components/services/UserService";

// const FilmTime = ({ movieDetails }) => {
//   const navigate = useNavigate();
//   const { movieId } = useParams(); // Lấy movieId từ URL
//   const [showTimes, setShowTimes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const goToSeatSelection = (showtimeId) => {
//     navigate("/seat-selection", {
//       state: { showtimeId, movieDetails},
//     });
//   };

//   useEffect(() => {
//     const getShowTimes = async () => {
//       try {
//         const res = await fetchShowTime(movieId); 
//         if (res.data && res.data.data) {
//           const filteredShowTimes = res.data.data.filter(
//             (item) => item.movieId === movieId
//           );
//           setShowTimes(filteredShowTimes); 
//         } else {
//           setShowTimes([]);
//         }
//       } catch (err) {
//         console.error("Error fetching showtimes:", err);
//         setError("Failed to fetch showtimes.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getShowTimes();
//   }, [movieId]);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="container">
//       {showTimes.length > 0 ? (
//         showTimes.map((item) => (
//           <div key={item.showtimeId} className="cinema">
//             <img
//               src="https://bhdstar.vn/wp-content/uploads/2023/08/logo.png"
//               alt={`${item.screen.cinema.cinemaName} Logo`}
//               className="logo"
//             />
//             <div className="cinema-info">
//               <h3>{item.screen.cinema.cinemaName}</h3>
//               <p>{item.screen.cinema.location.locationName}</p>
//             </div>
//             <div className="showtimes">
//               <button
//                 className="time-button"
//                 onClick={() => goToSeatSelection(item.showtimeId)}
//               >
//                 {new Date(item.showtimeAt).toLocaleString("en-GB", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })}
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="no-showtimes">Không có suất chiếu nào cho phim này.</p>
//       )}
//     </div>
//   );
// };

// export default FilmTime;









// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import { fetchShowTime } from "../../../../src/components/services/UserService";

// const FilmTime = ({ movieDetails }) => {
//   const navigate = useNavigate();
//   const { movieId } = useParams();
//   const [showTimes, setShowTimes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [customerId, setCustomerId] = useState(null);

//   // Hàm lấy customerId từ API khách hàng
//   const fetchCustomerId = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/customers");
//       if (response.data && response.data.data && response.data.data.length > 0) {
//         setCustomerId(response.data.data[0].customerId); // Lấy customerId từ phần tử đầu tiên
//       } else {
//         throw new Error("Failed to fetch customer data.");
//       }
//     } catch (err) {
//       console.error("Error fetching customer data:", err);
//       setError("Failed to fetch customer data.");
//     }
//   };

//   // Hàm điều hướng tới trang chọn ghế sau khi tạo booking
//   const goToSeatSelection = async (showtimeId) => {
//     try {
//       if (!customerId) {
//         throw new Error("Customer ID is not available.");
//       }

//       // Gọi API để tạo booking với showtimeId và customerId
//       const response = await axios.post("http://localhost:8080/bookings", {
//         showtimeId,
//         customerId,
//       });

//       console.log("Full API response:", response.data);

//       if (response.data && response.data.data) {
//         const bookingId = response.data.data.bookingId; // Lấy bookingId từ phản hồi API
//         console.log("Booking ID:", bookingId); 

//         // Điều hướng đến trang chọn ghế với thông tin bookingId
//         navigate("/seat-selection", {
//           state: { showtimeId, movieDetails, bookingId },
//         });
//       } else {
//         throw new Error("Failed to create booking.");
//       }
//     } catch (err) {
//       console.error("Error creating booking:", err);
//       setError("Failed to create booking. Please try again.");
//     }
//   };

//   useEffect(() => {
//     // Lấy customerId khi component được mount
//     fetchCustomerId();

//     const getShowTimes = async () => {
//       try {
//         const res = await fetchShowTime(movieId);
//         if (res.data && res.data.data) {
//           const filteredShowTimes = res.data.data.filter(
//             (item) => item.movieId === movieId
//           );
//           setShowTimes(filteredShowTimes);
//         } else {
//           setShowTimes([]);
//         }
//       } catch (err) {
//         console.error("Error fetching showtimes:", err);
//         setError("Failed to fetch showtimes.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     getShowTimes();
//   }, [movieId]);

//   if (loading) {
//     return <div className="loading">Loading...</div>;
//   }

//   if (error) {
//     return <div className="error">{error}</div>;
//   }

//   return (
//     <div className="container">
//       {showTimes.length > 0 ? (
//         showTimes.map((item) => (
//           <div key={item.showtimeId} className="cinema">
//             <img
//               src="https://bhdstar.vn/wp-content/uploads/2023/08/logo.png"
//               alt={`${item.screen.cinema.cinemaName} Logo`}
//               className="logo"
//             />
//             <div className="cinema-info">
//               <h3>{item.screen.cinema.cinemaName}</h3>
//               <p>{item.screen.cinema.location.locationName}</p>
//             </div>
//             <div className="showtimes">
//               <button
//                 className="time-button"
//                 onClick={() => goToSeatSelection(item.showtimeId)}
//               >
//                 {new Date(item.showtimeAt).toLocaleString("en-GB", {
//                   hour: "2-digit",
//                   minute: "2-digit",
//                   day: "2-digit",
//                   month: "2-digit",
//                   year: "numeric",
//                 })}
//               </button>
//             </div>
//           </div>
//         ))
//       ) : (
//         <p className="no-showtimes">Không có suất chiếu nào cho phim này.</p>
//       )}
//     </div>
//   );
// };

// export default FilmTime;




import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { fetchShowTime } from "../../../../src/components/services/UserService";

const FilmTime = ({ movieDetails }) => {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const [showTimes, setShowTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerId, setCustomerId] = useState(null);

  const fetchCustomerId = async () => {
    try {
      const response = await axios.get("http://localhost:8080/customers");
      if (response.data && response.data.data && response.data.data.length > 0) {
        setCustomerId(response.data.data[0].customerId);
      } else {
        throw new Error("Failed to fetch customer data.");
      }
    } catch (err) {
      console.error("Error fetching customer data:", err);
      setError("Failed to fetch customer data.");
    }
  };

  const goToSeatSelection = async (showtimeId) => {
    try {
      if (!customerId) {
        throw new Error("Customer ID is not available.");
      }

      const response = await axios.post("http://localhost:8080/bookings", {
        showtimeId,
        customerId,
      });

      console.log("Full API response:", response.data);

      if (response.data && response.data.data) {
        const bookingId = response.data.data.bookingId;
        console.log("Booking ID:", bookingId); 

        navigate("/seat-selection", {
          state: { showtimeId, movieDetails, bookingId },
        });
      } else {
        throw new Error("Failed to create booking.");
      }
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Failed to create booking. Please try again.");
    }
  };

  useEffect(() => {
    fetchCustomerId();

    const getShowTimes = async () => {
      try {
        const res = await fetchShowTime(movieId);
        if (res.data && res.data.data) {
          const filteredShowTimes = res.data.data.filter(
            (item) => item.movieId === movieId
          );
          setShowTimes(filteredShowTimes);
        } else {
          setShowTimes([]);
        }
      } catch (err) {
        console.error("Error fetching showtimes:", err);
        setError("Failed to fetch showtimes.");
      } finally {
        setLoading(false);
      }
    };

    getShowTimes();
  }, [movieId]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      {showTimes.length > 0 ? (
        showTimes.map((item) => (
          <div key={item.showtimeId} className="cinema">
            <img
              src="https://bhdstar.vn/wp-content/uploads/2023/08/logo.png"
              alt={`${item.screen.cinema.cinemaName} Logo`}
              className="logo"
            />
            <div className="cinema-info">
              <h3>{item.screen.cinema.cinemaName}</h3>
              <p>{item.screen.cinema.location.locationName}</p>
            </div>
            <div className="showtimes">
              <button
                className="time-button"
                onClick={() => goToSeatSelection(item.showtimeId)}
              >
                {new Date(item.showtimeAt).toLocaleString("en-GB", {
                  hour: "2-digit",
                  minute: "2-digit",
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="no-showtimes">Không có suất chiếu nào cho phim này.</p>
      )}
    </div>
  );
};

export default FilmTime;
