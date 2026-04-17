import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";

const Rating = () => {
    const { doctorId } = useParams();

    const [rating, setRating] = useState("");
    const [description, setDescription] = useState("");

    const giverating = async (e) => {
        e.preventDefault();

        try {
            const token = Cookies.get("emtoken"); 

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

            console.log(response.data);
            alert("Rating submitted");

            setRating("");
            setDescription("");

        } catch (error) {
            console.log(error);
            alert("Error submitting rating");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>Give Rating</h2>

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