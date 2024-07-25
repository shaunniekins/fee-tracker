# Fee Tracker Web Application

The Fee Tracker is a web application designed org officers to manage and keep track of transactions related to fees from students. With this application, officers can easily record and access information about student payments, helping them keep track of who has paid, when the payment was made, and other relevant details.

## Features

**User Authentication:** Utilizes Supabase for user authentication, ensuring that only authorized users can access the application.

**Transaction Management:** Org officers can record transactions, including the student's details, payment amount, date, and other relevant information.

**Payment History:** The application maintains a comprehensive payment history, allowing users to review past transactions and payments.

## Technologies Used

**Next.js:** A React framework for building server-rendered React applications.

**Tailwind CSS:** A utility-first CSS framework for building modern and responsive web interfaces.

**Supabase:** An open-source alternative to Firebase, Supabase provides a PostgreSQL database with real-time capabilities and authentication features.

**Supabase Authentication:** Supabase's built-in authentication system ensures secure and user-friendly access control to the application.

## Getting Started

Follow these steps to set up the Fee Tracker web application locally:

1. **Clone the Repository:**

```
git clone https://github.com/shaunniekins/fee-tracker.git
```

2. **Install Dependencies:**
   Navigate to the project directory and install the required dependencies.

```
cd fee-tracker
npm install
```

3. **Set Up Supabase:**

- Create a Supabase project and set up a PostgreSQL database.
- Configure Supabase Authentication and obtain the required API keys.
- Update the .env.local file with your Supabase project and authentication credentials.

4. **Start the Development Server:**
   Run the development server to start the application locally.

```
npm run dev
```

5. **Access the Application:**
   Open your web browser and go to http://localhost:8090/ to access the Fee Tracker.

## Usage

Once the application is set up, officers can:

**Sign in:** Use their Supabase authentication credentials to log in to the application.

**Record Transactions:** Add new transactions, providing the student's details, payment amount, date, and additional information.

**View Payment History:** Access the payment history to review and search for past transactions.
