<template>
    <div class="dashboard-container">
        <h1 class="dashboard-title">GO HARD OR GO HOME.</h1>
        <p v-if="confirmationMessage" class="confirmation-message">{{ confirmationMessage }}</p>

        <div class="selection-container">
            <div class="selection-box">
                <h2 class="section-title">Select a Gym</h2>
                <select v-model="selectedGym" @change="resetTrainerAndAppointment">
                    <option disabled value="">Please select a gym</option>
                    <option v-for="gym in gyms" :key="gym._id" :value="gym._id">
                        {{ gym.name }}
                    </option>
                </select>
            </div>

            <div class="selection-box" v-if="selectedGym">
                <h2 class="section-title">Select a Trainer</h2>
                <select v-model="selectedTrainer" @change="fetchAppointments">
                    <option disabled value="">Please select a trainer</option>
                    <option v-for="trainer in trainers" :key="trainer._id" :value="trainer._id">
                        {{ trainer.name }}
                    </option>
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

        <button @click="confirmAppointment" class="confirm-button" :disabled="!selectedGym || !selectedTrainer || !selectedAppointment">Confirm Appointment</button>

        <p v-if="reservationSuccess" class="success-message">You have successfully booked an appointment!</p>
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
                reservationSuccess: false
            };
        },
        async created() {
            try {
                const response = await axios.get('/gyms');
                this.gyms = response.data;

                const loggedInUser = this.$store.state.user;
                if (loggedInUser.selectedGym) {
                    this.selectedGym = loggedInUser.selectedGym;
                    this.selectedTrainer = loggedInUser.selectedTrainer;
                    this.selectedAppointment = loggedInUser.selectedAppointment;
                    await this.fetchTrainers();
                }
            } catch (error) {
                console.error(error);
                this.errorMessage = 'An error occurred. Please try again.';
            }
        },
        watch: {
            selectedGym: 'resetTrainerAndAppointment'
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
                } catch (error) {
                    this.errorMessage = 'An error occurred. Please try again.';
                }
            },
            async confirmAppointment() {
                try {
                    const trainer = this.trainers.find(t => t._id === this.selectedTrainer);
                    const gym = this.gyms.find(g => g._id === this.selectedGym);
                    const appointment = this.appointments.find(a => a._id === this.selectedAppointment);

                    if (trainer && gym && appointment) {
                        const loggedInUser = this.$store.state.user;

                        const data = {
                            userId: loggedInUser._id,
                            trainerId: trainer._id,
                            gymId: gym._id,
                            appointmentId: appointment._id
                        };

                        console.log("Sending the following data:", data);  

                        const response = await axios.post('/appointments/user-appointments', data);
                        console.log("Server response:", response.data);

                        if (response.data && response.data.success) {
                            this.confirmationMessage = `You have successfully booked an appointment with ${trainer.name} at ${gym.name} on ${appointment.date}.`;
                            this.reservationSuccess = true;
                            this.resetTrainerAndAppointment();
                        } else {
                            this.errorMessage = `Server returned an error: ${response.data ? response.data.message : 'No message'}`;
                        }

                    } else {
                        this.errorMessage = 'Please select a trainer, gym and appointment.';
                    }
                } catch (error) {
                    console.error("Error response from server:", error.response ? error.response.data : 'No response data');  
                    this.errorMessage = `An error occurred: ${error.message}`;
                }
            },
            resetTrainerAndAppointment() {
                this.selectedTrainer = null;
                this.selectedAppointment = null;
                this.fetchTrainers();
            }
        },
        computed: {
            formatAppointmentDate() {
                return function (isoDate) {
                    const date = new Date(isoDate);
                    const options = {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric'
                    };
                    return date.toLocaleString('en-US', options);
                };
            }
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
