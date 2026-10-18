import { app, analytics, db, collection, addDoc, serverTimestamp } from "./firebase.js";
const isExist = localStorage.getItem('isProductPageVisited');
if (!isExist) {
    // 2. If nothing is found, send them back to the checkout or home page
    window.location.href = 'index.html';
}
else {
   
    // Order Summary Toggle
    document.querySelector(".order-summary").addEventListener("click", () => {
        const summaryContent = document.getElementById("summaryContent");
        if (summaryContent.style.display === "block") {
            summaryContent.style.display = "none";
            document.querySelector(".order-summary h2 i").style.transform = "rotate(0deg)";
        }
        else {
            summaryContent.style.display = "block";
            document.querySelector(".order-summary h2 i").style.transform = "rotate(180deg)";
        }
    });
    let orderSummaryCalculation = () => {
        document.querySelector("#prices h4").innerText = "Rs " + Number(localStorage.getItem('productSubtotal') || 0).toLocaleString('en-US') + "/-";
        document.querySelector(".item-qty").innerText = localStorage.getItem("productQuantity") == null ? 2 : localStorage.getItem("productQuantity");
        document.querySelector(".totals-row span").innerText = localStorage.getItem("productQuantity") == null ? "Subtotal • " + 2 + " item's" : "Subtotal • " + localStorage.getItem("productQuantity") + " item's";
        document.getElementById("subtotalPrice").innerText = "Rs " + Number(localStorage.getItem('productSubtotal') || 0).toLocaleString('en-US') + "/-";
        document.querySelector("#prices h4").innerText = "Rs " + Number(localStorage.getItem('productSubtotal') || 0).toLocaleString('en-US') + "/-";
        setTimeout(() => {
            document.getElementById('shipping').classList.remove('shipping');
            let productQuantity = localStorage.getItem('productQuantity');
        if(productQuantity == 1){
            document.getElementById('shipping').innerHTML = `<span style="color: #777;">200.00</span>`;
            localStorage.setItem ('productSubtotalAfterDelivery',Number(localStorage.getItem('productSubtotal'))+200)
            document.getElementById("totalSpan").innerText = "Rs " + Number(localStorage.getItem('productSubtotalAfterDelivery') || 0).toLocaleString('en-US');
            document.querySelector("#prices h4").innerText = "Rs " + Number(localStorage.getItem('productSubtotalAfterDelivery') || 0).toLocaleString('en-US') + "/-";
        }
        else
            document.getElementById('shipping').innerHTML = `<span style="color: #777;">FREE</span>`;
            
        }, 3000);
        document.getElementById("totalSpan").innerText = "Rs " + Number(localStorage.getItem('productSubtotal') || 0).toLocaleString('en-US');
        
    }
    orderSummaryCalculation();























    document.addEventListener('DOMContentLoaded', () => {
        const completeBtn = document.querySelector('.complete-btn');
        const billingRadios = document.querySelectorAll('input[name="billing"]');

        // 1. Create and inject the Billing Address Section dynamically
        const billingContainer = document.createElement('div');
        billingContainer.id = 'billing-address-fields';
        billingContainer.style.display = 'none';
        billingContainer.style.padding = '1px';
        billingContainer.innerHTML = `
        <div class="input-group" style="margin-top:10px;">
            <select id="billing-country"><option>Pakistan</option></select>
        </div>
        <div class="input-group" style="margin-top:10px;">
            <input type="text" placeholder="Billing Address" id="billing-addr">
        </div>
        <div class="input-group">
            <input type="text" placeholder="Apartment, suite, etc. (optional)">
        </div>
        <div class="grid-2">
            <input type="text" placeholder="City" id="billing-city">
            <input type="text" placeholder="Postal code (optional)">
            <input type="tel" placeholder="Phone (optional)">
        </div>
    `;

        // Insert billing fields right after the billing radio selection box
        const billingBox = document.querySelector('input[name="billing"]').closest('div').parentElement;
        billingBox.appendChild(billingContainer);

        // 2. Toggle Billing Address Visibility
        window.toggleBilling = function (show) {
            billingContainer.style.display = show ? 'block' : 'none';
        };

        // 3. Validation Logic
        completeBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            let firstErrorField = null;

            // Reset previous errors
            document.querySelectorAll('input, select').forEach(el => el.style.border = "");

            function markError(field) {
                field.style.border = "1px solid red";
                field.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (!firstErrorField) firstErrorField = field;
            }

            // --- Validate Contact (Email or Phone) ---
            const contactInput = document.querySelector('input[placeholder="Email or phone number (optional)"]');
            const contactVal = contactInput.value.trim();
            const isEmail = contactVal.includes('@');
            const isPhone = /^(03|\+92)/.test(contactVal);

            if (contactVal === "") {
                // Optional field, no error if empty
            } else if (isEmail) {
                // Basic email check
                if (!contactVal.includes('.') || contactVal.length < 5) markError(contactInput);
            } else if (isPhone) {
                // Pakistan Phone: Must be 11 digits if starting with 03
                // If starting with +92, we normalize to check digits
                let digitsOnly = contactVal.replace('+', '');
                if (contactVal.startsWith('03') && contactVal.length !== 11) {
                    markError(contactInput);
                } else if (contactVal.startsWith('+92') && contactVal.length !== 13) {
                    markError(contactInput);
                }
            } else {
                markError(contactInput);
            }

            // --- Validate Delivery Fields ---
            const firstName = document.querySelector('input[placeholder="Name"]');
            const address = document.querySelector('input[placeholder="Address"]');
            const city = document.querySelector('input[placeholder="City"]');
            const phone = document.querySelector('input[placeholder="Phone"]');

            if (!firstName.value.trim()) markError(firstName);
            if (!address.value.trim()) markError(address);
            if (!city.value.trim()) markError(city);

            // Validate Shipping Phone (Standard Pakistan Logic)
            const pVal = phone.value.trim();
            if (!((pVal.startsWith('03') && pVal.length === 11) || (pVal.startsWith('+92') && pVal.length === 13))) {
                markError(phone);
            }

            // --- Validate Billing (Only if "Different address" is selected) ---
            const useDiffBilling = document.querySelectorAll('input[name="billing"]')[1].checked;
            if (useDiffBilling) {
                const bAddr = document.getElementById('billing-addr');
                const bCity = document.getElementById('billing-city');
                if (!bAddr.value.trim()) markError(bAddr);
                if (!bCity.value.trim()) markError(bCity);
            }

            // 4. Scroll to first error
            if (firstErrorField) {
                firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstErrorField.focus();
            } else {
                // --- DATA CAPTURE START ---
                const orderData = {
                    contact: contactInput.value.trim(),
                    createdAt: serverTimestamp(),
                    shipping: {
                        firstName: firstName.value.trim(),
                        address: address.value.trim(),
                        apartment: document.querySelector('input[placeholder*="Apartment"]').value.trim(),
                        city: city.value.trim(),
                        postalCode: document.querySelector('input[placeholder*="Postal code"]').value.trim(),
                        phone: phone.value.trim(),
                        orderNumber: Math.floor(Math.random() * 100000000).toString().padStart(8, '0')
                    },
                    billing: {},
                    orderSummary: {
                        orderTotal: localStorage.getItem("productSubtotal") == '999' ? localStorage.getItem("productSubtotalAfterDelivery") : localStorage.getItem("productSubtotal"),
                        quantity: localStorage.getItem("productQuantity") || 1,
                        color: localStorage.getItem("productColor") || "Gray"
                    }
                };

                // Capture Billing Data based on selection
                if (useDiffBilling) {
                    orderData.billing = {
                        type: "Different Address",
                        address: document.getElementById('billing-addr').value.trim(),
                        city: document.getElementById('billing-city').value.trim(),
                        // ... capture other billing fields here
                    };
                } else {
                    orderData.billing = { type: "Same as Shipping" };
                }

                // Now you can use this object!
                localStorage.setItem("InkBlissProductOrderData", JSON.stringify(orderData));
                completeBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Processing...`;

                await setDataInFireStore(orderData);

                window.location.href = "thankyou.html";

            }
        });
    });
}
async function setDataInFireStore(orderData) {
    const docRef = await addDoc(collection(db, "customer-data"), {
        wholeData: orderData
    });

    return docRef;
}
// ===============================
// DISCOUNT CODE LOGIC
// ===============================

const DISCOUNT_CODE = "ROVENA100";
const DISCOUNT_AMOUNT = 100;

const applyButton = document.getElementById("apply");
const codeInput = document.getElementById("discountCode");
const discountElement = document.getElementById("discount");
const totalSpan = document.getElementById("totalSpan");
const claimButton = document.getElementById("claim-btn");


// --------------------------------
// Helper: Get current subtotal
// --------------------------------

function getSubtotal() {
    if(localStorage.getItem('productQuantity') == 1){
        return Number(localStorage.getItem("productSubtotalAfterDelivery") || 999);
    }else
    return Number(localStorage.getItem("productSubtotal") || 0);
}


// --------------------------------
// Helper: Save subtotal
// --------------------------------

function saveSubtotal(amount) {
    if(localStorage.getItem('productQuantity') == 1){
        localStorage.setItem("productSubtotalAfterDelivery", String(amount));
    }else
    localStorage.setItem("productSubtotal", String(amount));
}


// --------------------------------
// Helper: Update total on screen
// --------------------------------

function updateTotal() {
    const subtotal = getSubtotal();

    totalSpan.innerText =
        "Rs " + subtotal.toLocaleString("en-US");
}


// --------------------------------
// Helper: Show discount UI
// --------------------------------

function showDiscountApplied() {
    if (discountElement) {
        discountElement.style.display = "flex";
    }

    if (codeInput) {
        codeInput.value = DISCOUNT_CODE;
        codeInput.style.border = "1px solid green";
    }

    if (applyButton) {
        applyButton.innerHTML = "Applied";
        applyButton.disabled = true;
        applyButton.style.opacity = "0.6";
        applyButton.style.cursor = "not-allowed";
    }
}


// --------------------------------
// Check if coupon was already used
// --------------------------------

const discountAlreadyUsed =
    localStorage.getItem("BLISS100_used") === "true";


// --------------------------------
// Restore coupon after page refresh
// --------------------------------

if (discountAlreadyUsed) {

    showDiscountApplied();

    updateTotal();
}


// --------------------------------
// Apply coupon
// --------------------------------

if (applyButton) {

    applyButton.addEventListener("click", () => {

        const enteredCode =
            codeInput.value.trim().toUpperCase();


        // =========================
        // Already used
        // =========================

        if (localStorage.getItem("BLISS100_used") === "true") {

            codeInput.value = "";
            codeInput.setAttribute(
                "placeholder",
                "Code already used"
            );

            codeInput.style.border = "1px solid #dc2626";

            setTimeout(() => {

                codeInput.style.border = "";
                codeInput.setAttribute(
                    "placeholder",
                    "Discount code"
                );

            }, 2000);

            return;
        }


        // =========================
        // Invalid code
        // =========================

        if (enteredCode !== DISCOUNT_CODE) {

            codeInput.value = "";

            codeInput.setAttribute(
                "placeholder",
                "Invalid Code"
            );

            codeInput.style.border = "1px solid red";


            setTimeout(() => {

                codeInput.style.border = "";
                codeInput.setAttribute(
                    "placeholder",
                    "Discount code"
                );

            }, 2000);

            return;
        }


        // =========================
        // Valid code
        // =========================

        applyButton.innerHTML =
            `<i class="fa-solid fa-spinner fa-spin"></i>`;

        applyButton.disabled = true;


        setTimeout(() => {

            // Get original/current subtotal
            let subtotal = getSubtotal();


            // Prevent accidental negative total
            if (subtotal < DISCOUNT_AMOUNT) {

                applyButton.innerHTML = "Apply";
                applyButton.disabled = false;

                return;
            }


            // Deduct discount
            subtotal -= DISCOUNT_AMOUNT;


            // Save new subtotal
            saveSubtotal(subtotal);


            // IMPORTANT:
            // Remember that BLISS100 has been used
            localStorage.setItem(
                "BLISS100_used",
                "true"
            );


            // Store discount amount separately
            localStorage.setItem(
                "discountAmount",
                String(DISCOUNT_AMOUNT)
            );


            // Show discount
            if (discountElement) {
                discountElement.style.display = "flex";
            }


            // Green border
            codeInput.style.border =
                "1px solid green";


            // Keep code visible
            codeInput.value = DISCOUNT_CODE;


            // Update total
            updateTotal();


            // Button state
            applyButton.innerHTML = "Applied";
            applyButton.disabled = true;
            applyButton.style.opacity = "0.6";
            applyButton.style.cursor = "not-allowed";


        }, 2000);
    });
}

// if (claimButton) {
//     claimButton.addEventListener("click", () => {
//         codeInput.value = DISCOUNT_CODE;
//         applyButton.click();
//         closeForm();
//     });
// }

// Announcement carousel rotation
const announcementItems = Array.from(document.querySelectorAll('.announcement-item')).filter(item => item.textContent.trim());
if (announcementItems.length > 0) {
    let activeIndex = announcementItems.findIndex(item => item.classList.contains('active'));
    if (activeIndex < 0) activeIndex = 0;
    announcementItems.forEach((item, index) => item.classList.toggle('active', index === activeIndex));
    setInterval(() => {
        announcementItems[activeIndex].classList.remove('active');
        activeIndex = (activeIndex + 1) % announcementItems.length;
        announcementItems[activeIndex].classList.add('active');
    }, 3500);
}
// function closeForm(){
//     document.getElementById("overlay").style.display = "none";
// }

// window.closeForm = closeForm;

// const EXIT_OFFER_SHOWN_KEY = "checkoutExitOfferShown";
// const overlay = document.getElementById("overlay");

// function showExitOffer() {
//     if (localStorage.getItem(EXIT_OFFER_SHOWN_KEY) === "true") {
//         return false;
//     }

//     localStorage.setItem(EXIT_OFFER_SHOWN_KEY, "true");
//     overlay.style.display = "flex";
//     return true;
// }

// document.addEventListener("mouseout", (event) => {
//     if (event.clientY <= 0 && !event.relatedTarget) {
//         showExitOffer();
//     }
// });

// const isMobile = window.matchMedia("(max-width: 768px)").matches || navigator.maxTouchPoints > 0;
// if (isMobile) {
//     history.pushState({ checkoutExitGuard: true }, "", window.location.href);

//     window.addEventListener("popstate", () => {
//         if (showExitOffer()) {
//             history.pushState({ checkoutExitGuard: true }, "", window.location.href);
//         }
//     });
// }
if (localStorage.getItem('productSubtotal') == '999' || localStorage.getItem('productSubtotal') == '1998' || localStorage.getItem('productSubtotal') == '2997'){
    document.getElementById('discount').style.display = 'none';
}
if(localStorage.getItem('productQuantity') == 1){
    document.getElementById('shippingMethod').innerText = '200.00'
}