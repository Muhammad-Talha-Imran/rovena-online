import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";


// ===============================
// FIREBASE CONFIG
// ===============================

const firebaseConfig = {
  apiKey: "AIzaSyAMzN7uKF4VEH5VEb-8t92N-AuNhtQhCpc",
  authDomain: "ecommerce-ae4aa.firebaseapp.com",
  projectId: "ecommerce-ae4aa",
  storageBucket: "ecommerce-ae4aa.firebasestorage.app",
  messagingSenderId: "284081024713",
  appId: "1:284081024713:web:fd266ccca923eea9742718",
  measurementId: "G-G22K9R4RGG"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


// ===============================
// STAR RATING
// ===============================

const stars = document.querySelectorAll("#stars span");

let selectedRating = 0;

const ratingText = document.getElementById("ratingText");

const ratingLabels = {
    1: "1 out of 5",
    2: "2 out of 5",
    3: "3 out of 5",
    4: "4 out of 5",
    5: "5 out of 5"
};

stars.forEach((star) => {

    star.addEventListener("click", () => {

        selectedRating = Number(star.dataset.rating);

        stars.forEach((s) => {
            s.classList.remove("active");

            if (Number(s.dataset.rating) <= selectedRating) {
                s.classList.add("active");
            }
        });

        ratingText.textContent = ratingLabels[selectedRating];

    });

});


// ===============================
// SUBMIT REVIEW
// ===============================

const submitBtn = document.getElementById("submitBtn");
const reviewInput = document.getElementById("review");
const message = document.getElementById("message");

submitBtn.addEventListener("click", async () => {

    const review = reviewInput.value.trim();


    // Validate rating
    if (selectedRating === 0) {

        message.textContent = "Please select a star rating.";
        message.style.color = "red";

        return;
    }


    // Validate review
    if (review.length === 0) {

        message.textContent = "Please write a review.";
        message.style.color = "red";

        return;
    }


    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";


    try {

        await addDoc(collection(db, "reviews"), {

            rating: selectedRating,

            review: review,

            status: "pending",

            createdAt: serverTimestamp()

        });


        message.textContent = "Thank you! Your review has been submitted.";
        message.style.color = "green";


        // Clear form
        reviewInput.value = "";

        selectedRating = 0;

        stars.forEach((star) => {
            star.classList.remove("active");
        });

        ratingText.textContent = "Select a rating";


        submitBtn.textContent = "Submitted";


    } catch (error) {

        console.error("Error submitting review:", error);

        message.textContent = "Something went wrong. Please try again.";
        message.style.color = "red";

        submitBtn.disabled = false;
        submitBtn.textContent = "Submit Review";

    }

});