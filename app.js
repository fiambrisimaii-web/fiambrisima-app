/**
 * Fiambrisima II - Frontend Logic
 * Works in Mock/Simulation mode by default. Connect to Google Sheets by setting API_URL below.
 */

// ----------------------------------------------------
// CONFIGURACIÓN: Ingresa aquí tu URL de Google Apps Script Web App
// ----------------------------------------------------
const API_URL = "https://script.google.com/macros/s/AKfycbxUrEylW9DF3Z0r_zkavwssfAdzj1cqJsxdZLBPF0INqUfQhmdOLfMH3MKk2GnUtBmk1Q/exec";

// ----------------------------------------------------
// FERIADOS NACIONALES ARGENTINA 2026 (Fallback local)
// ----------------------------------------------------
const ARG_HOLIDAYS_2026 = [
    "2026-01-01", // Año Nuevo
    "2026-02-16", // Carnaval
    "2026-02-17", // Carnaval
    "2026-03-24", // Día de la Memoria
    "2026-04-02", // Día de Malvinas / Jueves Santo
    "2026-04-03", // Viernes Santo
    "2026-05-01", // Día del Trabajador
    "2026-05-25", // Revolución de Mayo
    "2026-06-15", // Paso a la Inmortalidad de Güemes (Feriado trasladado)
    "2026-06-20", // Día de la Bandera
    "2026-07-09", // Día de la Independencia
    "2026-07-10", // Feriado puente turístico
    "2026-08-17", // Gral. José de San Martín
    "2026-10-12", // Día del Respeto a la Diversidad Cultural
    "2026-11-23", // Día de la Soberanía Nacional
    "2026-12-07", // Feriado puente turístico
    "2026-12-08", // Inmaculada Concepción
    "2026-12-25"  // Navidad
];

// Feriados dinámicos leídos desde Google Sheets
let sheetHolidays = [];

// ----------------------------------------------------
// CARTA OFICIAL DE FIAMBRISIMA II (Exactamente 19 Platos)
// ----------------------------------------------------
const LOCAL_MENU = [
    // MENÚS DIARIOS
    { id: 1, name: "Menú General del Día", category: "menús", price: 3400, desc: "El plato principal recomendado del día, elaborado con ingredientes frescos y el toque casero de Fiambrisima II.", tags: "Recomendado" },
    { id: 2, name: "Menú Veggie del Día", category: "menús", price: 3400, desc: "Nuestra alternativa vegetariana diaria, saludable, equilibrada y deliciosa.", tags: "Saludable" },
    { id: 3, name: "Milanesa de Carne con Puré", category: "menús", price: 3800, desc: "Milanesa de ternera casera súper tierna con puré de papas", tags: "Clásico" },
    { id: 4, name: "Suprema Napolitana con Arroz", category: "menús", price: 3700, desc: "Suprema de pechuga de pollo rebozada, a la napolitana, acompañada de arroz", tags: "Popular" },
    
    // EMPANADAS
    { id: 5, name: "Empanada de Jamón y Queso", category: "empanadas", price: 650, desc: "Empanada clásica de masa casera rellena de jamón cocido y queso mozzarella fundido.", tags: "Horno" },
    { id: 6, name: "Empanada de Jamón, Queso y Huevo", category: "empanadas", price: 680, desc: "Rellena de jamón, mozzarella y huevo duro picado.", tags: "Horno" },
    { id: 7, name: "Empanada de Carne", category: "empanadas", price: 650, desc: "Empanada clásica de carne picada premium", tags: "Criolla" },
    { id: 8, name: "Empanada de Pollo", category: "empanadas", price: 650, desc: "Rellena de pollo desmenuzado cocido a la portuguesa con cebolla y morrón.", tags: "Horno" },
    { id: 9, name: "Empanada de Verdura", category: "empanadas", price: 650, desc: "Rellena de acelga fresca cocida al vapor, ricota suave y queso mozzarella.", tags: "Veggie" },
    
    // TARTAS
    { id: 10, name: "Tarta de Jamón y Queso", category: "tartas", price: 2900, desc: "Tarta individual hojaldrada con capas de jamón cocido y mozzarella fundida.", tags: "Clásico" },
    { id: 11, name: "Tarta de Choclo", category: "tartas", price: 2800, desc: "Tarta individual rellena de crema de choclo dulce y queso mozzarella.", tags: "Veggie" },
    { id: 12, name: "Tarta de Zapallitos", category: "tartas", price: 2800, desc: "Tarta rellena de zapallitos redondos salteados con cebolla y huevo, gratinada con queso.", tags: "Veggie" },
    { id: 13, name: "Tarta de Verdura", category: "tartas", price: 2800, desc: "Tarta casera y saludable con masa hojaldrada y abundante verdura.", tags: "Saludable" },
    { id: 14, name: "Tarta de Pollo", category: "tartas", price: 3100, desc: "Tarta hojaldrada rellena de jugoso pollo.", tags: "Casera" },
    
    // SÁNDWICHES
    { id: 15, name: "Sándwich de Milanesa de Carne (L/T/H)", category: "sándwiches", price: 3700, desc: "Milanesa de carne vacuna en pan francés crujiente con lechuga, tomate y huevo duro.", tags: "Sándwich" },
    { id: 16, name: "Sándwich de Milanesa de Carne Completo", category: "sándwiches", price: 4100, desc: "Milanesa de carne vacuna con jamón, queso, huevo duro, lechuga y tomate.", tags: "Completo" },
    { id: 17, name: "Sándwich de Milanesa de Pollo (L/T/H)", category: "sándwiches", price: 3500, desc: "Suprema de pollo rebozada en pan francés con lechuga, tomate y huevo duro.", tags: "Sándwich" },
    { id: 18, name: "Sándwich de Milanesa de Pollo Completo", category: "sándwiches", price: 3900, desc: "Suprema de pollo rebozada con jamón, queso, huevo duro, lechuga y tomate.", tags: "Completo" },
    
    // ENSALADAS
    { id: 19, name: "Ensalada a Elección", category: "ensaladas", price: 3300, desc: "Arma tu ensalada eligiendo tus ingredientes favoritos.", tags: "Personalizada" }
];

// Categorías del Menú
const CATEGORIES = [
    { id: "todos", name: "Todos" },
    { id: "menús", name: "Menús" },
    { id: "empanadas", name: "Empanadas" },
    { id: "tartas", name: "Tartas" },
    { id: "sándwiches", name: "Sándwiches" },
    { id: "ensaladas", name: "Ensaladas" }
];

// Días de preparación (LUNES A VIERNES únicamente)
const DAYS_OF_WEEK = [
    { id: "lunes", name: "Lunes", offset: 0 },
    { id: "martes", name: "Martes", offset: 1 },
    { id: "miercoles", name: "Miércoles", offset: 2 },
    { id: "jueves", name: "Jueves", offset: 3 },
    { id: "viernes", name: "Viernes", offset: 4 }
];

// ----------------------------------------------------
// ESTADO DE LA APLICACIÓN
// ----------------------------------------------------
let menuData = [...LOCAL_MENU];
let activeCategory = "todos";
let activeDayId = "lunes"; 
let currentWeeks = []; 
const deliveryMethod = "pickup"; // Hardcoded: Solo retiro en local
const deliveryFee = 0;          // Costo de envío: $0 pesos

// Estructura del Carrito: { "YYYY-MM-DD": { platoId: cantidad } }
let cart = {};

// Datos del Cliente y Período seleccionado
let orderMetadata = {
    clientName: "",
    clientPhone: "",
    clientAddress: "Retiro en local",
    selectedMonth: "",
    selectedWeekLabel: "",
    selectedWeekIndex: 0,
    weekStartDate: null, 
};

// ----------------------------------------------------
// INICIALIZACIÓN
// ----------------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    initCalendarSelectors();
    initCategoryPills();
    setupEventListeners();
    fetchMenu(); // Carga desde Sheets si está configurado
});

// ----------------------------------------------------
// LÓGICA DE CALENDARIO Y FECHAS
// ----------------------------------------------------
function initCalendarSelectors() {
    const monthSelect = document.getElementById("select-month");
    const weekSelect = document.getElementById("select-week");
    
    const now = new Date();
    const currentMonthIndex = now.getMonth();
    const currentYear = now.getFullYear();

    const monthNames = [
        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];

    monthSelect.innerHTML = "";
    for (let i = 0; i < 3; i++) {
        let m = (currentMonthIndex + i) % 12;
        let y = currentYear + Math.floor((currentMonthIndex + i) / 12);
        
        const option = document.createElement("option");
        option.value = `${y}-${m}`;
        option.textContent = `${monthNames[m]} ${y}`;
        monthSelect.appendChild(option);
    }

    monthSelect.addEventListener("change", () => {
        const [year, monthIdx] = monthSelect.value.split("-").map(Number);
        updateWeekSelector(year, monthIdx);
    });

    const [year, monthIdx] = monthSelect.value.split("-").map(Number);
    updateWeekSelector(year, monthIdx);

    weekSelect.addEventListener("change", () => {
        selectWeek(Number(weekSelect.value));
    });
}

function updateWeekSelector(year, monthIndex) {
    const weekSelect = document.getElementById("select-week");
    weekSelect.innerHTML = "";

    const weeks = [];
    let date = new Date(year, monthIndex, 1);
    
    const day = date.getDay();
    const diffToMonday = date.getDate() - day + (day === 0 ? -6 : 1);
    let currentMonday = new Date(year, monthIndex, diffToMonday);

    for (let w = 0; w < 6; w++) {
        let mon = new Date(currentMonday);
        mon.setDate(currentMonday.getDate() + (w * 7));
        
        let fri = new Date(mon);
        fri.setDate(mon.getDate() + 4); 

        if (mon.getMonth() === monthIndex || fri.getMonth() === monthIndex) {
            weeks.push({
                monday: mon,
                friday: fri,
                label: `Sem. del ${formatDateShort(mon)} al ${formatDateShort(fri)}`
            });
        }
    }

    currentWeeks = weeks;

    weeks.forEach((wk, idx) => {
        const option = document.createElement("option");
        option.value = idx;
        option.textContent = wk.label;
        weekSelect.appendChild(option);
    });

    selectWeek(0);
}

function selectWeek(weekIdx) {
    if (currentWeeks.length === 0) return;
    const week = currentWeeks[weekIdx];
    
    orderMetadata.selectedWeekIndex = weekIdx;
    orderMetadata.selectedWeekLabel = week.label;
    orderMetadata.weekStartDate = week.monday;

    const monthSelect = document.getElementById("select-month");
    orderMetadata.selectedMonth = monthSelect.options[monthSelect.selectedIndex].text;

    document.getElementById("week-range-text").textContent = 
        `Viendo viandas para el período: ${week.label} (${orderMetadata.selectedMonth})`;

    activeDayId = "lunes";

    renderDayTabs();
    renderMenuItems();
}

function renderDayTabs() {
    const tabsContainer = document.getElementById("day-tabs-container");
    tabsContainer.innerHTML = "";

    DAYS_OF_WEEK.forEach(day => {
        const dayDate = new Date(orderMetadata.weekStartDate);
        dayDate.setDate(orderMetadata.weekStartDate.getDate() + day.offset);

        const lockState = checkIsDayLocked(dayDate); 
        const countInDay = getCartCountForDate(formatDateISO(dayDate));

        const tab = document.createElement("div");
        tab.className = `day-tab ${day.id === activeDayId ? "active" : ""}`;
        
        if (lockState === "holiday") {
            tab.classList.add("holiday");
        } else if (lockState === "past") {
            tab.classList.add("locked");
        }

        tab.setAttribute("data-day-id", day.id);
        tab.setAttribute("data-date-iso", formatDateISO(dayDate));
        
        tab.innerHTML = `
            <span class="tab-name">${day.name}</span>
            <span class="tab-date">${formatDateShort(dayDate)}</span>
            ${countInDay > 0 ? `<span class="day-tab-badge">${countInDay}</span>` : ""}
        `;

        tab.addEventListener("click", () => {
            activeDayId = day.id;
            document.querySelectorAll(".day-tab").forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            renderMenuItems();
        });

        tabsContainer.appendChild(tab);
    });
}

function checkIsDayLocked(targetDate) {
    const dateISO = formatDateISO(targetDate);
    
    // A. Comprobar Feriados
    if (ARG_HOLIDAYS_2026.includes(dateISO) || sheetHolidays.includes(dateISO)) {
        return "holiday";
    }

    // B. Comprobar Límite del día anterior (23:59)
    const now = new Date();
    const targetMidnight = new Date(
        targetDate.getFullYear(),
        targetDate.getMonth(),
        targetDate.getDate(),
        0, 0, 0, 0
    );

    if (now >= targetMidnight) {
        return "past";
    }
    
    return false;
}

// ----------------------------------------------------
// NAVEGACIÓN Y FILTROS DEL MENÚ
// ----------------------------------------------------
function initCategoryPills() {
    const container = document.getElementById("category-pills-container");
    container.innerHTML = "";

    CATEGORIES.forEach(cat => {
        const pill = document.createElement("button");
        pill.className = `category-pill ${cat.id === activeCategory ? "active" : ""}`;
        pill.textContent = cat.name;
        pill.addEventListener("click", () => {
            activeCategory = cat.id;
            document.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
            pill.classList.add("active");
            renderMenuItems();
        });
        container.appendChild(pill);
    });
}

function renderMenuItems() {
    const grid = document.getElementById("menu-items-grid");
    grid.innerHTML = "";

    const activeDayObj = DAYS_OF_WEEK.find(d => d.id === activeDayId);
    const dayDate = new Date(orderMetadata.weekStartDate);
    dayDate.setDate(orderMetadata.weekStartDate.getDate() + activeDayObj.offset);
    const dateISO = formatDateISO(dayDate);

    const lockState = checkIsDayLocked(dayDate);
    const banner = document.getElementById("day-lock-banner");
    const bannerTitle = document.getElementById("lock-banner-title");
    const bannerDesc = document.getElementById("lock-banner-desc");
    
    if (lockState) {
        banner.classList.remove("hidden");
        grid.classList.add("locked-day");
        
        if (lockState === "holiday") {
            bannerTitle.innerHTML = `<i class="fa-solid fa-calendar-xmark"></i> Feriado - Local Cerrado`;
            bannerDesc.textContent = "Hoy no cocinamos por ser feriado patrio / nacional. Selecciona otro día de la semana.";
        } else {
            bannerTitle.innerHTML = `<i class="fa-solid fa-lock"></i> Pedidos Cerrados para este día`;
            bannerDesc.textContent = "El límite de carga fue a las 23:59 del día anterior. Puedes visualizar tu pedido, pero no editarlo.";
        }
    } else {
        banner.classList.add("hidden");
        grid.classList.remove("locked-day");
    }

    const searchQuery = document.getElementById("search-input").value.toLowerCase().trim();

    const filteredMenu = menuData.filter(item => {
        const matchesCategory = activeCategory === "todos" || item.category === activeCategory;
        const matchesSearch = item.name.toLowerCase().includes(searchQuery) || 
                              item.desc.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesSearch;
    });

    if (filteredMenu.length === 0) {
        grid.innerHTML = `
            <div class="info-banner" style="grid-column: 1/-1; background-color: rgba(20,54,39,0.04); color: var(--accent); border-color: var(--border-color)">
                <i class="fa-solid fa-face-frown"></i>
                No encontramos comidas con los filtros indicados.
            </div>
        `;
        return;
    }

    filteredMenu.forEach(item => {
        let qty = 0;
        let cardHtml = "";
        
        if (item.id === 19) {
            // RENDER ESPECIAL DE ENSALADA A ELECCIÓN (CON CHECKBOXES)
            const currentKey = getSaladKey();
            qty = getCartItemQuantity(dateISO, currentKey);
            
            cardHtml = `
                <div class="menu-img-container">
                    <span class="menu-tag">${item.category}</span>
                    <i class="fa-solid fa-carrot menu-placeholder-img"></i>
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p class="menu-desc">${item.desc}</p>
                    
                    <div class="salad-ingredients">
                        <p class="ingredients-label">Selecciona ingredientes:</p>
                        <div class="checkbox-grid">
                            <label><input type="checkbox" class="salad-ing" value="Lechuga" checked onchange="onSaladCheckboxChange('${dateISO}')"> Lechuga</label>
                            <label><input type="checkbox" class="salad-ing" value="Tomate" checked onchange="onSaladCheckboxChange('${dateISO}')"> Tomate</label>
                            <label><input type="checkbox" class="salad-ing" value="Pollo" checked onchange="onSaladCheckboxChange('${dateISO}')"> Pollo</label>
                            <label><input type="checkbox" class="salad-ing" value="Huevo" checked onchange="onSaladCheckboxChange('${dateISO}')"> Huevo</label>
                            <label><input type="checkbox" class="salad-ing" value="Zanahoria" checked onchange="onSaladCheckboxChange('${dateISO}')"> Zanahoria</label>
                            <label><input type="checkbox" class="salad-ing" value="Arroz" checked onchange="onSaladCheckboxChange('${dateISO}')"> Arroz</label>
                        </div>
                    </div>
                    
                    <div class="menu-bottom" style="margin-top: 10px;">
                        <span class="menu-price">$${item.price}</span>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="adjustQuantity('${dateISO}', 19, -1)" ${lockState ? "disabled" : ""}>-</button>
                            <span class="qty-val" id="qty-${dateISO}-19">${qty}</span>
                            <button class="qty-btn" onclick="adjustQuantity('${dateISO}', 19, 1)" ${lockState ? "disabled" : ""}>+</button>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // RENDER DE PLATO NORMAL
            qty = getCartItemQuantity(dateISO, item.id);
            cardHtml = `
                <div class="menu-img-container">
                    <span class="menu-tag">${item.category}</span>
                    <i class="fa-solid fa-bowl-food menu-placeholder-img"></i>
                </div>
                <div class="menu-info">
                    <h3>${item.name}</h3>
                    <p class="menu-desc">${item.desc}</p>
                    <div class="menu-bottom">
                        <span class="menu-price">$${item.price}</span>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="adjustQuantity('${dateISO}', ${item.id}, -1)" ${lockState ? "disabled" : ""}>-</button>
                            <span class="qty-val" id="qty-${dateISO}-${item.id}">${qty}</span>
                            <button class="qty-btn" onclick="adjustQuantity('${dateISO}', ${item.id}, 1)" ${lockState ? "disabled" : ""}>+</button>
                        </div>
                    </div>
                </div>
            `;
        }

        const card = document.createElement("div");
        card.className = `menu-card ${qty > 0 ? "in-cart" : ""}`;
        card.innerHTML = cardHtml;
        grid.appendChild(card);
    });
}

/**
 * Retorna la clave única del carrito para la ensalada en base a los checkboxes marcados
 */
function getSaladKey() {
    const checkedIngs = Array.from(document.querySelectorAll(".salad-ing:checked")).map(el => el.value);
    if (checkedIngs.length === 0) return "19_Sin ingredientes";
    return "19_" + checkedIngs.join("_");
}

/**
 * Escucha los cambios de ingredientes en la ensalada y actualiza el contador del carrito en tiempo real
 */
function onSaladCheckboxChange(dateISO) {
    const key = getSaladKey();
    const qty = getCartItemQuantity(dateISO, key);
    const label = document.getElementById(`qty-${dateISO}-19`);
    
    if (label) {
        label.textContent = qty;
        const card = label.closest(".menu-card");
        if (qty > 0) {
            card.classList.add("in-cart");
        } else {
            card.classList.remove("in-cart");
        }
    }
}

// ----------------------------------------------------
// GESTIÓN DEL CARRITO
// ----------------------------------------------------
function adjustQuantity(dateISO, platoId, delta) {
    const targetDate = new Date(dateISO + "T00:00:00");
    if (checkIsDayLocked(targetDate)) {
        alert("Pedidos cerrados para esta fecha.");
        return;
    }

    if (!cart[dateISO]) {
        cart[dateISO] = {};
    }

    // Si es ensalada, resolvemos la clave única en base a ingredientes
    let cartKey = platoId;
    if (platoId === 19) {
        cartKey = getSaladKey();
    }

    const currentQty = cart[dateISO][cartKey] || 0;
    let newQty = currentQty + delta;
    if (newQty < 0) newQty = 0;

    if (newQty === 0) {
        delete cart[dateISO][cartKey];
        if (Object.keys(cart[dateISO]).length === 0) {
            delete cart[dateISO];
        }
    } else {
        cart[dateISO][cartKey] = newQty;
    }

    const qtyLabel = document.getElementById(`qty-${dateISO}-${platoId}`);
    if (qtyLabel) {
        qtyLabel.textContent = newQty;
        const card = qtyLabel.closest(".menu-card");
        if (newQty > 0) {
            card.classList.add("in-cart");
        } else {
            card.classList.remove("in-cart");
        }
    }

    renderDayTabs();
    updateFloatingCartBar();
}

function getCartItemQuantity(dateISO, platoId) {
    if (cart[dateISO] && cart[dateISO][platoId]) {
        return cart[dateISO][platoId];
    }
    return 0;
}

function getCartCountForDate(dateISO) {
    if (!cart[dateISO]) return 0;
    return Object.values(cart[dateISO]).reduce((sum, q) => sum + q, 0);
}

function getCartTotals() {
    let totalItems = 0;
    let totalPrice = 0;

    Object.keys(cart).forEach(dateISO => {
        Object.keys(cart[dateISO]).forEach(cartKey => {
            const qty = cart[dateISO][cartKey];
            if (cartKey.toString().startsWith("19_")) {
                totalItems += qty;
                totalPrice += 3300 * qty; // Precio ensalada
            } else {
                const menuProduct = menuData.find(p => p.id === Number(cartKey));
                if (menuProduct) {
                    totalItems += qty;
                    totalPrice += menuProduct.price * qty;
                }
            }
        });
    });

    return { totalItems, totalPrice };
}

function updateFloatingCartBar() {
    const floatingBar = document.getElementById("cart-floating-bar");
    const { totalItems, totalPrice } = getCartTotals();

    if (totalItems > 0) {
        floatingBar.classList.remove("hidden");
        document.getElementById("cart-total-badge").textContent = totalItems;
        document.getElementById("cart-total-price").textContent = `$${totalPrice}`;
    } else {
        floatingBar.classList.add("hidden");
    }
}

// ----------------------------------------------------
// MODAL DE CHECKOUT Y DETALLE DE COMPRA
// ----------------------------------------------------
function openCheckoutModal() {
    const name = document.getElementById("client-name").value.trim();
    const phone = document.getElementById("client-phone").value.trim();

    if (!name || !phone) {
        alert("Por favor, completa tu Nombre y Teléfono antes de continuar.");
        document.getElementById("customer-card").scrollIntoView({ behavior: "smooth" });
        return;
    }

    orderMetadata.clientName = name;
    orderMetadata.clientPhone = phone;

    document.getElementById("sum-name").querySelector("span").textContent = orderMetadata.clientName;
    document.getElementById("sum-phone").querySelector("span").textContent = orderMetadata.clientPhone;
    document.getElementById("sum-period-text").textContent = 
        `${orderMetadata.selectedMonth} - ${orderMetadata.selectedWeekLabel}`;

    const itemsContainer = document.getElementById("summary-items-container");
    itemsContainer.innerHTML = "";

    const sortedDates = Object.keys(cart).sort();

    sortedDates.forEach(dateISO => {
        const dateObj = new Date(dateISO + "T00:00:00");
        const dayName = getDayNameFromDate(dateObj);
        
        const dayGroup = document.createElement("div");
        dayGroup.className = "summary-day-group";
        
        let itemsHtml = "";
        Object.keys(cart[dateISO]).forEach(cartKey => {
            const qty = cart[dateISO][cartKey];
            let name = "";
            let price = 0;
            
            if (cartKey.toString().startsWith("19_")) {
                const ingredients = cartKey.split("_").slice(1).join(", ");
                name = `Ensalada personalizada (${ingredients})`;
                price = 3300;
            } else {
                const item = menuData.find(p => p.id === Number(cartKey));
                if (item) {
                    name = item.name;
                    price = item.price;
                }
            }
            
            if (name) {
                itemsHtml += `
                    <div class="summary-item-row">
                        <span class="sum-item-name"><span class="sum-item-qty">${qty}x</span> ${name}</span>
                        <span class="sum-item-price">$${price * qty}</span>
                    </div>
                `;
            }
        });

        dayGroup.innerHTML = `
            <div class="summary-day-header">
                <span>${dayName}</span>
                <span class="date-txt">${formatDateShort(dateObj)}</span>
            </div>
            <div class="summary-day-items">
                ${itemsHtml}
            </div>
        `;
        itemsContainer.appendChild(dayGroup);
    });

    const { totalPrice } = getCartTotals();
    document.getElementById("sum-grand-total").textContent = `$${totalPrice}`;

    document.getElementById("checkout-modal").classList.remove("hidden");
}

function closeCheckoutModal() {
    document.getElementById("checkout-modal").classList.add("hidden");
}

// ----------------------------------------------------
// ENVÍO DE PEDIDOS (API / SIMULACIÓN)
// ----------------------------------------------------
function submitOrder() {
    const orderId = "PED-" + Math.floor(100000 + Math.random() * 900000);
    const { totalPrice } = getCartTotals();

    const itemsBreakdown = [];
    Object.keys(cart).forEach(dateISO => {
        Object.keys(cart[dateISO]).forEach(cartKey => {
            const qty = cart[dateISO][cartKey];
            let name = "";
            let price = 0;
            let itemId = 19;
            
            if (cartKey.toString().startsWith("19_")) {
                const ingredients = cartKey.split("_").slice(1).join(", ");
                name = `Ensalada personalizada (${ingredients})`;
                price = 3300;
            } else {
                const item = menuData.find(p => p.id === Number(cartKey));
                if (item) {
                    name = item.name;
                    price = item.price;
                    itemId = item.id;
                }
            }
            
            if (name) {
                itemsBreakdown.push({
                    platoId: itemId,
                    nombre: name,
                    precioUnitario: price,
                    cantidad: qty,
                    fechaEntrega: dateISO,
                    diaSemana: getDayNameFromDate(new Date(dateISO + "T00:00:00"))
                });
            }
        });
    });

    const payload = {
        orderId: orderId,
        fechaPedido: formatDateISO(new Date()),
        clienteNombre: orderMetadata.clientName,
        clienteTelefono: orderMetadata.clientPhone,
        metodoEntrega: "pickup",
        clienteDireccion: "Retiro en local",
        periodoMes: orderMetadata.selectedMonth,
        periodoSemana: orderMetadata.selectedWeekLabel,
        items: itemsBreakdown,
        costoEnvio: 0,
        totalGral: totalPrice
    };

    closeCheckoutModal();
    showStatusOverlay();
    showState("loading");

    if (!API_URL || API_URL === "TU_URL_DE_GOOGLE_APPS_SCRIPT") {
        setTimeout(() => {
            handleOrderSuccess(orderId, "https://www.mercadopago.com.ar/checkout/v1/redirect?pref_id=mock_pref_fiambrisima", payload);
        }, 2000);
    } else {
        fetch(API_URL, {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "text/plain"
            },
            body: JSON.stringify(payload)
        })
        .then(response => {
            if (!response.ok) throw new Error("Error en la conexión del servidor");
            return response.json();
        })
        .then(data => {
            if (data.status === "success") {
                handleOrderSuccess(orderId, data.paymentUrl, payload);
            } else {
                throw new Error(data.message || "Error procesando el backend");
            }
        })
        .catch(error => {
            console.error("Error al procesar el pedido:", error);
            handleOrderError(error.message, payload);
        });
    }
}

function handleOrderSuccess(orderId, paymentUrl, payload) {
    showState("success");
    
    const mpLink = document.getElementById("mp-payment-link");
    mpLink.href = paymentUrl;

    const wsBtn = document.getElementById("whatsapp-confirm-btn");
    wsBtn.classList.remove("hidden");
    wsBtn.onclick = () => {
        sendOrderViaWhatsApp(payload, orderId, "Hola Fiambrisima II! Acabo de registrar mi pedido de viandas: ");
    };

    window.open(paymentUrl, "_blank");
}

function handleOrderError(errMsg, payload) {
    showState("error");
    document.getElementById("error-message-text").textContent = 
        `No pudimos registrar tu pedido automáticamente en nuestra planilla por un error de conexión (${errMsg}). Por favor haz click abajo para enviárnoslo por WhatsApp y coordinar de forma manual.`;

    const wsFallbackBtn = document.getElementById("whatsapp-fallback-btn");
    wsFallbackBtn.classList.remove("hidden");
    wsFallbackBtn.onclick = () => {
        sendOrderViaWhatsApp(payload, "PENDIENTE", "Hola Fiambrisima II! Envío mi pedido de viandas manualmente: ");
    };
}

function sendOrderViaWhatsApp(payload, orderId, prefix) {
    const businessPhone = "5491112345678"; // Reemplazar con el WhatsApp real del local
    
    let text = `${prefix}\n\n`;
    text += `*Orden Nro:* ${orderId}\n`;
    text += `*Cliente:* ${payload.clienteNombre}\n`;
    text += `*WhatsApp:* ${payload.clienteTelefono}\n`;
    text += `*Modalidad:* Retiro en Local (Take Away)\n`;
    text += `*Período:* ${payload.periodoMes} - ${payload.periodoSemana}\n\n`;
    text += `*DETALLE DE LAS VIANDAS:*\n`;

    const groupedItems = {};
    payload.items.forEach(it => {
        if (!groupedItems[it.fechaEntrega]) {
            groupedItems[it.fechaEntrega] = { dia: it.diaSemana, list: [] };
        }
        groupedItems[it.fechaEntrega].list.push(it);
    });

    Object.keys(groupedItems).sort().forEach(dateISO => {
        const group = groupedItems[dateISO];
        const dateObj = new Date(dateISO + "T00:00:00");
        text += `\n*📅 ${group.dia} (${formatDateShort(dateObj)})*:\n`;
        group.list.forEach(item => {
            text += `  • ${item.cantidad}x ${item.nombre} ($${item.precioUnitario * item.cantidad})\n`;
        });
    });

    text += `\n*TOTAL A PAGAR:* $${payload.totalGral}\n`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${businessPhone}?text=${encodedText}`;
    window.open(whatsappUrl, "_blank");
}

function showStatusOverlay() {
    document.getElementById("status-overlay").classList.remove("hidden");
}

function hideStatusOverlay() {
    document.getElementById("status-overlay").classList.add("hidden");
}

function showState(stateId) {
    document.getElementById("state-loading").classList.add("hidden");
    document.getElementById("state-success").classList.add("hidden");
    document.getElementById("state-error").classList.add("hidden");

    document.getElementById(`state-${stateId}`).classList.remove("hidden");
}

function resetAppAfterSuccess() {
    cart = {};
    updateFloatingCartBar();
    renderDayTabs();
    renderMenuItems();
    hideStatusOverlay();
}

function fetchMenu() {
    if (!API_URL || API_URL === "TU_URL_DE_GOOGLE_APPS_SCRIPT") {
        console.log("Corriendo en modo simulación (Mock). Menú local cargado.");
        return;
    }

    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            if (data && data.status === "success") {
                if (data.menu && data.menu.length > 0) {
                    menuData = data.menu.map(item => ({
                        id: Number(item.ID),
                        name: item.Nombre,
                        category: item.Categoria.toLowerCase().replace(/\s/g, ""),
                        price: Number(item.Precio),
                        desc: item.Descripcion || "",
                        tags: item.Tags || ""
                    }));
                }
                if (data.feriados) {
                    sheetHolidays = data.feriados;
                }
                console.log("Menú dinámico y feriados cargados con éxito desde Google Sheets.");
                renderDayTabs();
                renderMenuItems();
            } else if (Array.isArray(data)) {
                menuData = data.map(item => ({
                    id: Number(item.ID),
                    name: item.Nombre,
                    category: item.Categoria.toLowerCase().replace(/\s/g, ""),
                    price: Number(item.Precio),
                    desc: item.Descripcion || "",
                    tags: item.Tags || ""
                }));
                console.log("Menú simple cargado desde Sheets.");
                renderMenuItems();
            }
        })
        .catch(err => {
            console.error("Error cargando base de datos remota, usando fallback local:", err);
        });
}

function setupEventListeners() {
    const searchInput = document.getElementById("search-input");
    const clearBtn = document.getElementById("clear-search-btn");

    searchInput.addEventListener("input", () => {
        if (searchInput.value.trim().length > 0) {
            clearBtn.classList.remove("hidden");
        } else {
            clearBtn.classList.add("hidden");
        }
        renderMenuItems();
    });

    clearBtn.addEventListener("click", () => {
        searchInput.value = "";
        clearBtn.classList.add("hidden");
        renderMenuItems();
    });
}

// ----------------------------------------------------
// FUNCIONES AUXILIARES DE FECHAS
// ----------------------------------------------------
function formatDateISO(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

function formatDateShort(date) {
    const d = String(date.getDate()).padStart(2, "0");
    const m = String(date.getMonth() + 1).padStart(2, "0");
    return `${d}/${m}`;
}

function getDayNameFromDate(date) {
    const days = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days[date.getDay()];
}
