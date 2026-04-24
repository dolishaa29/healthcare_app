import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const Rating = () => {
    const { doctorId } = useParams();

    const [rating, setRating] = useState("");
    const [description, setDescription] = useState("");
    const [data, setData] = useState([]);


    const fetchRatings = async () => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/viewrating/${doctorId}`
            );
            console.log(response.data.data);
            setData(response.data.data);

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, []);

    const giverating = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get("token");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/getrating`,
                {
                    doctorId,
                    rating,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Rating submitted");

            setRating("");
            setDescription("");

            fetchRatings();
        } catch (error) {
            console.log(error);
            alert("Error submitting rating");
        }
    };

    return (
        <div style={{ padding: "20px" }}>

            <h2>All Ratings</h2>

            {data.length === 0 ? (
                <p>No ratings found</p>
            ) : (
                data.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            border: "1px solid #ddd",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "8px"
                        }}
                    >
                        <h3> Rating: {item.rating}</h3>
                        <p>{item.description}</p>

                        <hr />

                        <p><b> Doctor:</b> {item.doctor?.name}</p>
                        <p><b> User:</b> {item.user?.name}</p>
                    </div>
                ))
            )}

            <hr />

            <h2>Add Rating</h2>

            <form onSubmit={giverating}>

                <input
                    type="number"
                    placeholder="Rating (1-5)"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />

                <br /><br />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <br /><br />

                <button type="submit">Submit</button>

            </form>

        </div>
    );
};

export default Rating;