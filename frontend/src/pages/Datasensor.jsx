import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Pagination from '@mui/material/Pagination';
import TextField from '@mui/material/TextField';

function Datasensor() {
    const [data, setData] = useState([]);
    const [sortOrder, setSortOrder] = useState('desc'); // 'desc' để sắp xếp theo ID mới nhất đứng đầu
    const [page, setPage] = useState(1);
    const [searchTime, setSearchTime] = useState(''); // Thời gian tìm kiếm
    const rowsPerPage = 10;

    // Sử dụng useEffect để gọi API và cập nhật dữ liệu
    useEffect(() => {
        fetch('http://localhost:3000/api/datalog') // Điều chỉnh URL API theo địa chỉ thực tế
            .then(response => response.json())
            .then(data => setData(data))
            .catch(error => console.error('Lỗi: ' + error));
    }, []);

    useEffect(() => {
        const sortedData = [...data];

        sortedData.sort((a, b) => {
            if (sortOrder === 'desc') {
                return b.id - a.id; // Sắp xếp theo ID từ lớn đến nhỏ (mới nhất đứng đầu)
            } else {
                return a.id - b.id; // Sắp xếp theo ID từ nhỏ đến lớn (cũ nhất đứng đầu)
            }
        });

        setData(sortedData);
    }, [sortOrder, data]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearch = (event) => {
        setSearchTime(event.target.value);
        setPage(1); // Trở về trang đầu tiên khi tìm kiếm
    };

    function formatTime(time) {
        const originalDate = new Date(time);
        const year = originalDate.getFullYear();
        const month = String(originalDate.getMonth() + 1).padStart(2, '0');
        const day = String(originalDate.getDate()).padStart(2, '0');
        const hours = String(originalDate.getHours()).padStart(2, '0');
        const minutes = String(originalDate.getMinutes()).padStart(2, '0');
        const seconds = String(originalDate.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;

    const filteredData = data.filter(item => item.time.includes(searchTime));

    const displayedData = filteredData.slice(startIndex, endIndex);

    return (
        <div className="flex flex-1 flex-col px-20 pt-8">
            {/* Thanh tìm kiếm */}
            <TextField
                label="Thời gian tìm kiếm"
                variant="outlined"
                value={searchTime}
                onChange={handleSearch}
            />

            {/* Render bảng dữ liệu */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Temperature</TableCell>
                            <TableCell>Humidity</TableCell>
                            <TableCell>Brightness</TableCell>
                            <TableCell>Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedData.map(item => (
                            <TableRow
                                key={item.id}
                                className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover-bg-neutral-600"
                            >
                                <TableCell>{item.id}</TableCell>
                                <TableCell>{item.temperature}</TableCell>
                                <TableCell>{item.humidity}</TableCell>
                                <TableCell>{item.brightness}</TableCell>
                                <TableCell>{formatTime(item.time)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Pagination
                count={Math.ceil(filteredData.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
            />
        </div>
    );
}

export default Datasensor;
