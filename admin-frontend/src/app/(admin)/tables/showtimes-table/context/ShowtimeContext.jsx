// import React, { createContext, useReducer, useEffect } from 'react';
// import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';

// export const ShowtimeContext = createContext();

// const pageSize = 2;

// const initialState = {
//   showtimes: [],
//   query: '',
//   filters: [],
//   currentPage: 1,
//   totalPages: 1,
// };

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'SET_SHOWTIMES':
//       // make showtimeAt readable
//       action.payload.forEach((showtime) => {
//         showtime.showtimeAt = new Date(showtime.showtimeAt).toLocaleString();
//       });
//       return { ...state, showtimes: action.payload };
//     case 'SET_QUERY':
//       return { ...state, query: action.payload };
//     case 'SET_FILTERS':
//       return { ...state, filters: action.payload };
//     case 'SET_CURRENT_PAGE':
//       return { ...state, currentPage: action.payload };
//     case 'SET_TOTAL_PAGES':
//       return { ...state, totalPages: action.payload };
//     default:
//       return state;
//   }
// };

// export const ShowtimeProvider = ({ children }) => {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const location = useLocation();
//   const navigate = useNavigate();

//   // const showtimeApiUrl = `http://localhost:8080/showtimes?search=${state.query}&page=${state.currentPage}&filters=${state.filters.join(',')}`;
//   // useEffect(() => {
//   //   fetchShowtimes();
//   // }, [state.currentPage, state.query, state.filters]);

//   // for debug
//   const showtimeApiUrl = `http://localhost:8080/showtimes`;
//   useEffect(() => {
//     fetchShowtimes();
//   }, []);

//   useEffect(() => {
//     const params = new URLSearchParams(location.search || '');
//     const query = params.get('query') || '';
//     const filters = params.get('filters') ? params.get('filters').split(',') : [];
//     const currentPage = parseInt(params.get('page'), 10) || 1;

//     dispatch({ type: 'SET_QUERY', payload: query });
//     dispatch({ type: 'SET_FILTERS', payload: filters });
//     dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage });
//   }, [location.search]);

//   const fetchShowtimes = () => {
//     fetch(showtimeApiUrl)
//       .then((response) => response.json())
//       .then((json) => {
//         dispatch({ type: 'SET_SHOWTIMES', payload: json.data });
//         dispatch({ type: 'SET_TOTAL_PAGES', payload: Math.ceil(json.data.count / pageSize) });
//       })
//       .catch((error) => console.error('Error fetching showtimes:', error));
//   };

//   const updateQueryParams = (params) => {
//     const searchParams = new URLSearchParams(location.search);
//     Object.keys(params).forEach((key) => {
//       if (params[key] !== undefined) {
//         searchParams.set(key, params[key]);
//       } else {
//         searchParams.delete(key);
//       }
//     });
//     navigate({ search: searchParams.toString() });
//   };

//   return (
//     <ShowtimeContext.Provider value={{ state, dispatch, fetchShowtimes, updateQueryParams }}>
//       <Routes>
//         <Route path="*" element={children} />
//       </Routes>
//     </ShowtimeContext.Provider>
//   );
// };


import React, { createContext, useReducer, useEffect } from 'react';
import { useLocation, useNavigate, Routes, Route } from 'react-router-dom';

export const ShowtimeContext = createContext();

const pageSize = 10; // Số lượng phần tử trên mỗi trang

const initialState = {
  showtimes: [],
  movies: [],
  cinemas: [],
  screens: [],
  query: '',
  filters: [],
  currentPage: 1,
  totalPages: 1,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_SHOWTIMES':
      if (Array.isArray(action.payload)) {
        action.payload.forEach((showtime) => {
          showtime.showtimeAt = new Date(showtime.showtimeAt).toISOString().split('T')[0];
        });
      } else {
        console.error('Expected payload to be an array, but received:', action.payload);
      }
      return { ...state, showtimes: Array.isArray(action.payload) ? action.payload : [] };
    case 'SET_MOVIES':
      return { ...state, movies: action.payload };
    case 'SET_CINEMAS':
      return { ...state, cinemas: action.payload };
    case 'SET_SCREENS':
      return { ...state, screens: action.payload };
    case 'SET_QUERY':
      return { ...state, query: action.payload };
    case 'SET_FILTERS':
      return { ...state, filters: action.payload };
    case 'SET_CURRENT_PAGE':
      return { ...state, currentPage: action.payload };
    case 'SET_TOTAL_PAGES':
      return { ...state, totalPages: action.payload };
    default:
      return state;
  }
};

// Component Provider để cung cấp dữ liệu và hành động tới các component con
export const ShowtimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const navigate = useNavigate();

  const buildApiUrl = () => {
    const params = new URLSearchParams({
      search: state.query || '',
      page: state.currentPage || 1,
      pageSize: pageSize,
      filters: state.filters.join(','),
      sortBy: 'showtimePrice',
      sortDirection: 'DESC',
    });
    return `http://localhost:8080/showtimes?${params.toString()}`;
  };

  const fetchShowtimes = () => {
    const apiUrl = buildApiUrl();
    fetch(apiUrl)
      .then((response) => response.json())
      .then((json) => {
        if (json && json.data && Array.isArray(json.data.result)) {
          dispatch({ type: 'SET_SHOWTIMES', payload: json.data.result });
          dispatch({ type: 'SET_TOTAL_PAGES', payload: Math.ceil(json.data.count / pageSize) });
        } else {
          console.error('Expected json.data.result to be an array, but received:', json.data);
        }
      })
      .catch((error) => console.error('Error fetching showtimes:', error));
  };

  const fetchCinemas = () => {
    const cinemaApiUrl = `http://localhost:8080/cinemas`;
    fetch(cinemaApiUrl)
      .then((response) => response.json())
      .then((json) => dispatch({ type: 'SET_CINEMAS', payload: json.data }))
      .catch((error) => console.error('Error fetching cinemas:', error));
  };

  const fetchScreen = () => {
    const screenApiUrl = `http://localhost:8080/screens`;
    fetch(screenApiUrl)
      .then((response) => response.json())
      .then((json) => dispatch({ type: 'SET_SCREENS', payload: json.data }))
      .catch((error) => console.error('Error fetching screens:', error));
  };

  const updateQueryParams = (params) => {
    const searchParams = new URLSearchParams(location.search);

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined) {
        searchParams.set(key, params[key]);
      } else {
        searchParams.delete(key);
      }
    });

    navigate({ search: searchParams.toString() });
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search || '');
    const query = params.get('query') || '';
    const filters = params.get('filters') ? params.get('filters').split(',') : [];
    const currentPage = parseInt(params.get('page'), 10) || 1;

    dispatch({ type: 'SET_QUERY', payload: query });
    dispatch({ type: 'SET_FILTERS', payload: filters });
    dispatch({ type: 'SET_CURRENT_PAGE', payload: currentPage });
  }, [location.search]);

  useEffect(() => {
    fetchShowtimes();
    fetchScreen();
    fetchCinemas();
  }, [state.currentPage, state.query, state.filters]);

  return (
    <ShowtimeContext.Provider value={{ state, dispatch, fetchShowtimes, updateQueryParams }}>
      <Routes>
        <Route path="*" element={children} />
      </Routes>
    </ShowtimeContext.Provider>
  );
};
