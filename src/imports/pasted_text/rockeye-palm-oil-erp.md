Figma AI Prompt – ROCKEYE Palm Oil ERP (Sarafiah Export Process)
Objective

Design a modern enterprise ERP application for the Palm Oil industry based on the latest Sarafiah Export Order Fulfillment Workflow (AS-IS).

The application should feel like a premium enterprise ERP similar to SAP Fiori, Oracle Fusion Cloud, Microsoft Dynamics 365, Odoo Enterprise, and the existing ROCKEYE ERP.

This is NOT a generic ERP.

The entire application must be designed around the actual business workflow and user roles.

Design Language

Follow these design principles:

Modern Enterprise UI
Minimalistic
Premium
White background
Blue primary theme (#2563EB style)
Soft gray borders
Rounded cards (10–12px radius)
Flat icons
Large typography
Spacious layout
Dashboard-first approach
Consistent spacing (8px grid)
Enterprise-level usability
Responsive desktop (1440px)
No gradients
No glassmorphism
No neumorphism
No excessive colors
No infographic style

Visual inspiration:

SAP Fiori
Microsoft Dynamics 365
Oracle Fusion
Atlassian
ROCKEYE ERP
Authentication Flow

Design the following screens:

Screen 1

Login

Fields

Email

Buttons

Next
Screen 2

Password

Fields

Password

Buttons

Back
Login
Screen 3

Organization Selection

Example

ROCKEYE Palm Oil

Screen 4 (Most Important)

Role Selection

Instead of selecting modules, users select their business role.

Create beautiful role cards.

Example roles:

Customer
Sales Manager
Contract Management
Production Planning Manager
Procurement Manager
Warehouse Manager
QA Manager
Production Manager
Export Documentation Executive
Logistics Manager
Finance Manager
System Administrator

Each card should contain:

Icon
Role Name
Small description
Number of pending tasks
"Continue" button

Example

Sales Manager

Manage customer orders, contracts, pricing and approvals.

Pending Tasks

12

After Login

Each role opens a completely different dashboard.

Menus must be generated dynamically according to the logged-in role.

Users should never see modules outside their responsibility.

Overall Layout

Header

Company Logo
Search
Notifications
Recent Activities
Language
User Profile
Role Badge

Left Sidebar

Role-based navigation only.

Main Area

Dashboard widgets

Cards

Charts

Recent activities

Approval queue

Pending work

Design the Application Based on the Latest Business Process

The application should implement the latest Sarafiah Export Process.

The workflow is:

Customer

↓

Sales

↓

Contract Approval

↓

Production Planning

↓

Procurement

↓

Warehouse

↓

QA

↓

Production

↓

Export Documentation

↓

Shipping

↓

Finance

↓

Customer

This workflow should drive the navigation, permissions, approvals and dashboards.

Role Based Modules
Customer

Dashboard

Menus

My Orders
Shipment Tracking
Documents
Commercial Invoice
Packing List
Bill of Lading
Payments

Widgets

Open Orders
Shipment Status
Pending Documents
Sales Manager

Menus

Customer Orders
Customer Order Recording
Sales Contract Acquisition
Sales Contract Creation
Contract Status
Customer Communication

Widgets

Orders Pending
Contracts Awaiting Approval
New Customer Orders
Contract Management

Menus

Contract Review
Contract Approval
Price Agreement
Contract Versions

Widgets

Pending Approvals
Recently Approved Contracts
Production Planning Manager

This is one of the most important dashboards.

Menus

Material Availability
Production Planning
Capacity Planning
Vessel Schedule
Container Requisition
Prioritization

Widgets

Material Availability
Finished Goods Stock
Packaging Stock
Today's Production Plan
Capacity Utilization
Pending Planning
Procurement Manager

Menus

Purchase Orders
Suppliers
Delivery Schedule
Material Receiving

Widgets

Pending PO
Deliveries
Supplier Performance
Material Shortages
Warehouse Manager

Menus

Weighbridge
Material Receiving
Warehouse Inventory
Container Reception
Loading Ticket

Widgets

Incoming Materials
Storage Capacity
Dispatch Queue
QA Manager

Menus

Material Inspection
QA Approval
Certificate of Analysis
Health Certificate

Widgets

Pending QA
Rejected Materials
Inspection Queue
Production Manager

Menus

Production Orders
Batch
Packaging
Container Stuffing
Dispatch

Widgets

Running Production
Today's Production
Production Efficiency
Batch Status
Export Documentation Executive

Menus

Shipping Instruction
Packing List
Commercial Invoice
Draft Bill of Lading
Final Bill of Lading
Customs Declaration
Export Documents

Widgets

Pending Documents
Draft BL Awaiting Confirmation
Customs Status
Logistics Manager

Menus

Vessel Booking
Container Allocation
Dispatch
Delivery to Port

Widgets

Vessel Schedule
Containers
Dispatch Queue
Finance Manager

Menus

Commercial Validation
Payment Collection
Settlement
Customer Payments

Widgets

Outstanding Payments
Daily Collections
Receivables
Business Rules

Implement these business rules from the latest workflow.

Production Planning depends on

Current Finished Goods Stock
Packaging Material Stock
Order Prioritization

Material Receiving

Weighbridge
Oil Inspection
Packaging Material Inspection

Production

Production
Packaging
Container Reception
Container Stuffing
Loading Ticket
Dispatch

Export Documentation

Shipping Instruction
Packing List
Commercial Invoice
Draft BL
Final BL
Customs Declaration

Auto Generated Documents

Health Certificate
Certificate of Analysis
Other Export Documents

Business Rule

Export cannot proceed until pending unreleased Bills of Lading are resolved.

Screen Types to Design

Design all of these:

Dashboard
List Page
Detail View
Creation Form
Approval Screen
Timeline View
Document Viewer
Reports
Notifications
Search Results
User Profile
Settings
Activity Log
Components

Create reusable design system components:

Buttons
Cards
KPI Widgets
Tables
Filters
Search
Date Pickers
Status Chips
Approval Timeline
Stepper
Tabs
Sidebar
Header
Modal
Toast Notification
Empty States
Loading States
Pagination
UX Principles

The interface should feel like an enterprise application used daily by operations teams.

Focus on:

Fast navigation
Minimal clicks
Clear ownership
Excellent readability
High information density without clutter
Consistent spacing
Responsive layouts
Role-based access
Workflow-driven navigation
Professional visual hierarchy

Every screen should look production-ready and suitable for a real enterprise deployment. The final output should resemble a polished commercial ERP product rather than a concept, with all screens sharing a consistent design system and closely following the latest Sarafiah export workflow.