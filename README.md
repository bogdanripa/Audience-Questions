# Audience Questions

Welcome to the Audience Questions application! This app is designed for conference speakers to interact live with their audience, allowing attendees to ask questions and vote on them in real time. Built on the https://genezio.com/ platform, this application facilitates a more engaging and democratic Q&A session.

## Features

- **Live Question Submissions**: Audience members can submit questions live during the event.
- **Voting System**: Attendees can vote on questions they find interesting or relevant.
- **Real-Time Updates**: Speakers can view and manage live questions ordered by the number of votes.
- **Secure Speaker Access**: A secure "secret key" system ensures that only authorized users can access the speaker view.

## Getting Started

### Prerequisites

- A https://genezio.com/ account.
- The genezio CLI installed on your local machine.
- MongoDB connection set up as the database. (go to https://mongodb.com/ to get one)

### Setup

1. Install the genezio CLI (`npm install genezio -g`)
2. Clone this repository.
3. Set up your environment variables:
   - Copy `server/.env.sample` to `server/.env`.
   - Update the `SPEAKER_SECRET` with your secret key.
   - Set the MongoDB connection URL.
4. Deploy the application using `genezio deploy`.
5. Update the SOCKET_URL env variable: Go to https://app.genez.io/dashboard, choose your project, click "Test Project" and copy the class URL. You can find it under "Requests will be sent to" and should look somethink like "https://GUID.us-east-1.cluster.genez.io"
6. run `genezio deploy` again
7. Go to https://app.genez.io/dashboard, choose your project, Backend, Environment Variables, and make sure that what you have in the local `server/.env` file matches

## Usage

- **For Audience Members**: Navigate to the homepage via the QR code shown at the event or directly through `https://APP-URL/qr/`.
- **For Speakers**: Access the speaker page at `https://APP-URL/speaker/`. Enter the `SPEAKER_SECRET` when prompted to view and manage questions.

## Live Demo

You can see a sample of the app running here: [Audience Questions Demo](https://apricot-devoted-cephalopod.app.genez.io/)

## Support

For support, issues, or feature requests, submit an issue through the GitHub issue tracker.

---

Thank you for using Audience Questions!
