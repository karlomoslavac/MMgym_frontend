<template>
    <div class="dashboard-container">
        <h1 class="dashboard-title">GO HARD OR GO HOME.</h1>
        <p v-if="confirmationMessage" class="confirmation-message">{{ confirmationMessage }}</p>

        <div class="selection-container">
            <div class="selection-box">
                <h2 class="section-title">Select a Gym</h2>
                <select v-model="selectedGym" @change="fetchTrainers()">
                    <option disabled value="">Please select a gym</option>
                    <option v-for="gym in gyms" :key="gym._id" :value="gym._id">{{ gym.name }}</option>
                </select>
            </div>

            <div class="selection-box" v-if="selectedGym">
                <h2 class="section-title">Select a Trainer</h2>
                <select v-model="selectedTrainer" @change="fetchAppointments()">
                    <option disabled value="">Please select a trainer</option>
                    <option v-for="trainer in trainers" :key="trainer._id" :value="trainer._id">{{ trainer.name }}</option>
                </select>
            </div>

            <div class="selection-box" v-if="selectedTrainer">
                <h2 class="section-title">Select a Date/Time</h2>
                <select v-model="selectedAppointment">
                    <option disabled value="">Please select a date/time</option>
                    <option v-for="appointment in appointments" :key="appointment._id" :value="appointment._id">
                        {{ formatAppointmentDate(appointment.date) }}
                    </option>
                </select>
            </div>
        </div>

        <button v-if="selectedAppointment" @click="confirmAppointment" class="confirm-button">Confirm Appointment</button>

    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                gyms: [],
                trainers: [],
                appointments: [],
                selectedGym: null,
                selectedTrainer: null,
                selectedAppointment: null,
                errorMessage: null,
                confirmationMessage: null,
                reservationSuccess: false,
            };
        },
        async created() {
            try {
                const response = await axios.get('/gyms');
                this.gyms = response.data;
            } catch (error) {
                console.error(error);
                this.errorMessage = 'An error occurred. Please try again.';
            }
        },
        methods: {
            async fetchTrainers() {
                if (!this.selectedGym) {
                    this.trainers = [];
                    return;
                }
                try {
                    const response = await axios.get(`/trainers/${this.selectedGym}/trainers`);
                    this.trainers = response.data;
                    this.selectedTrainer = null;
                    this.selectedAppointment = null;
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred. Please try again.';
                }
            },
            async fetchAppointments() {
                try {
                    if (!this.selectedTrainer) {
                        this.appointments = [];
                        return;
                    }

                    const response = await axios.get(`/appointments/trainers/${this.selectedTrainer}/appointments`);
                    this.appointments = response.data;
                    this.selectedAppointment = null;
                } catch (error) {
                    this.errorMessage = 'An error occurred. Please try again.';
                }
            },
            async confirmAppointment() {
                try {
                    const trainer = this.trainers.find((t) => t._id === this.selectedTrainer);
                    const gym = this.gyms.find((g) => g._id === this.selectedGym);
                    const appointment = this.appointments.find((a) => a._id === this.selectedAppointment);

                    if (trainer && gym && appointment) {
                        const loggedInUser = this.$store.state.user;

                        const data = {
                            selectedGym: gym._id,
                            selectedTrainer: trainer._id,
                            selectedAppointment: appointment._id,
                        };

                        const response = await axios.post(`/users/${loggedInUser._id}/selected`, data);

                        if (response.status === 200) {
                            this.confirmationMessage = `You have successfully booked an appointment with ${trainer.name} at ${gym.name} on ${this.formatAppointmentDate(appointment.date)}.`;

                            this.reservationSuccess = true;
                            this.resetToInitialState();
                        } else {
                            this.errorMessage = 'An error occurred while confirming the appointment.';
                        }
                    } else {
                        this.errorMessage = 'Please select a trainer, gym, and appointment.';
                    }
                } catch (error) {
                    console.error('Error confirming appointment:', error);
                    this.errorMessage = 'An error occurred while confirming the appointment.';
                }
            },

            resetToInitialState() {
                this.selectedGym = null;
                this.selectedTrainer = null;
                this.selectedAppointment = null;
                this.errorMessage = null;
                this.reservationSuccess = false;
            },
            formatAppointmentDate(isoDate) {
                const date = new Date(isoDate);
                const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                };
                return date.toLocaleString('en-US', options);
            },
        },
    };
</script>

<style scoped>
    .dashboard-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100% - 60px);
    }

    .selection-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 800px;
        margin-bottom: 20px;
        padding-top: 60px;
    }

    .selection-box {
        flex: 1;
        margin: 0 10px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .section {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
        justify-content: center;
    }

    .sections-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        padding: 0 20px;
        margin-bottom: 60px;
    }

    .dashboard-title,
    .section-title {
        width: fit-content;
        text-align: center;
        color: white;
        background-color: rgba(0, 0, 0, 0.77);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .error-message {
        color: red;
        padding: 10px;
        border-radius: 5px;
    }

    .confirmation-message {
        background-color: rgba(0, 0, 0, 0.77);
        color: green;
        padding: 10px;
        border-radius: 5px;
    }

    .confirm-button {
        padding: 10px 20px;
        border-radius: 5px;
        background-color: #007BFF;
        color: white;
        cursor: pointer;
        margin-top: 20px;
    }
</style>
