import { Agenda } from "agenda";


const agenda = new Agenda({
    db: {
        address: process.env.MONGODB_URI!,
        collection: "agendaJobs",
    },
});

export default agenda;