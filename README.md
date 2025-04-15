# MJML Order Confirmation Email Generator

A responsive, dynamic HTML email generator built using **MJML** and **Handlebars**.  
Created as part of an internship assignment by a 2nd-year Business IT student to demonstrate data transformation, templating logic, and visual formatting in email design.

---

## Overview

This project reads structured JSON order data and transforms it into a responsive HTML email template that includes:

- **Main products**
- **Sub-products** (e.g. insurance) shown with 24px indentation  
- **Filtering out background-only blocks** (e.g., hidden technical items)
- **Visual formatting** based on stakeholder feedback

---

## Tools Used

- **Node.js**
- **Handlebars** – for injecting dynamic data
- **MJML** – for responsive email structure
- **JSON** – as the data source

---

## Process & Logic

### 1. Load & Parse Data
- Read `orderBasket.json`, which contains nested objects for customer info, products, and prices.
- Extract and format relevant fields: customer name, shipping address, products, etc.

### 2. Transform Data for Rendering
- Each `productOrderItem` is mapped to a main product block.
- If a product includes sub-products (`productOrderItem` array), they are **filtered** and **mapped separately**.
- Products with missing prices (used for background purposes only) are **excluded**.

### 3. Apply Handlebars Templating
- Dynamic values like `{{customerName}}`, `{{shippingAddress}}`, and looping through `{{#each products}}` are inserted into the MJML email template.
- Sub-products are rendered conditionally using nested loops and indented visually with MJML's `padding`.

### 4. Convert MJML → HTML
- The final MJML string is compiled to HTML using `mjml()` function.
- Output is written to `output.html` and ready for email preview or testing.

---

## Output
See [`output.html`](./output.html) for the final email result.
