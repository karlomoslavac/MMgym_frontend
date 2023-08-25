<template>
    <div class="dashboard-container">
        <h1 class="dashboard-title">OWNER DASHBOARD</h1>
        <div class="sections-container">
            <div class="section">
                <h2 class="section-title">Gyms</h2>
                <form @submit.prevent="addGym" class="form-container">
                    <div class="input-container">
                        <input v-model="newGymName" placeholder="Gym name" required>
                    </div>
                    <div class="input-container">
                        <input v-model="newGymLocation" placeholder="Gym location" required>
                    </div>
                    <div class="input-container">
                        <select v-model="newGymOwner" required class="select-owner">
                            <option disabled value="">Please select an owner</option>
                            <option v-for="owner in owners" :value="owner._id" :key="owner._id">
                                {{ owner.username }}
                            </option>
                        </select>
                    </div>
                    <div class="input-container">
                        <button type="submit">Add Gym</button>
                    </div>
                </form>
                <ul v-if="gyms" class="list-container">
                    <li v-for="gym in gyms" :key="gym._id" class="list-item list-item-style">
                        {{ gym.name }} - {{ gym.location }} - {{ getOwnerNameById(gym.owner) }}
                        <button @click="deleteGym(gym._id)">Delete</button>
                    </li>
                </ul>
            </div>
            <div class="section">
                <h2 class="section-title">Trainers</h2>
                <form @submit.prevent="addTrainer" class="form-container">
                    <div class="input-container">
                        <input v-model="newTrainerName" placeholder="Trainer name" required>
                    </div>
                    <div class="input-container">
                        <select v-model="newTrainerGym" required>
                            <option disabled value="">Please select a gym</option>
                            <option v-for="gym in gyms" :value="gym._id" :key="gym._id">
                                {{ gym.name }}
                            </option>
                        </select>
                    </div>
                    <div class="input-container">
                        <button type="submit">Add Trainer</button>
                    </div>
                </form>
                <ul v-if="trainers" class="list-container">
                    <li v-for="trainer in trainers" :key="trainer._id" class="list-item list-item-style">
                        {{ trainer.name }} - {{ getGymNameById(trainer.gym) }}
                        <button @click="deleteTrainer(trainer._id)">Delete</button>
                    </li>
                </ul>
            </div>
            <div class="section">
                <h2 class="section-title">Trainings</h2>
                <form @submit.prevent="addAppointment" class="form-container">
                    <div class="input-container">
                        <flat-pickr v-model="newAppointmentDate" :config="datePickerConfig"></flat-pickr>
                    </div>
                    <div class="input-container">
                        <select v-model="newAppointmentTrainer" required>
                            <option disabled value="">Please select a trainer</option>
                            <option v-for="trainer in trainers" :value="trainer._id" :key="trainer._id">
                                {{ trainer.name }}
                            </option>
                        </select>
                    </div>
                    <div class="input-container">
                        <button type="submit">Add Date</button>
                    </div>
                </form>
                <ul v-if="appointments" class="list-container">
                    <li v-for="appointment in appointments" :key="appointment._id" class="list-item list-item-style">
                        {{ formatAppointmentDate(appointment.date) }} - {{ getTrainerNameById(appointment.trainer) }}
                        <button @click="deleteAppointment(appointment._id)">Delete</button>
                    </li>
                </ul>
            </div>
        </div>
        <div class="users-section">
            <h2>Users INFO</h2>
            <table class="users-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Selected Gym</th>
                        <th>Selected Couch</th>
                        <th>Selected Date</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user._id">
                        <td>{{ user._id }}</td>
                        <td>{{ user.username }}</td>
                        <td>{{ user.role }}</td>
                        <td>{{ user.selectedGym ? user.selectedGym.name : 'N/A' }}</td>
                        <td>{{ user.selectedTrainer ? user.selectedTrainer.name : 'N/A' }}</td>
                        <td>{{ user.selectedAppointment ? user.selectedAppointment.time : 'N/A' }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';
    import FlatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';

    export default {
        components: {
            FlatPickr,
        },
        data() {
            return {
                users: [],
                trainers: null,
                gyms: [],
                appointments: null,
                owners: [],
                errorMessage: null,
                newTrainerName: '',
                newTrainerGym: '',
                newGymName: '',
                newGymLocation: '',
                newGymOwner: '',
                newAppointmentDate: null,
                newAppointmentTrainer: '',
                datePickerConfig: {
                    enableTime: true,
                    dateFormat: 'Y-m-d H:i',
                    minDate: new Date().toISOString() 
                },
            };
        },
        created() {
            this.fetchData();
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
        methods: {
            async fetchUsers() {
                try {
                    const token = localStorage.getItem('token');
                    if (!token) {
                        console.error('Token not found');
                        return;
                    }

                    const { data } = await axios.get('http://localhost:3000/users', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });

                    if (data && Array.isArray(data)) {
                        this.users = data;
                        console.log("Fetched users:", this.users);
                    } else {
                        console.error("Unexpected data format:", data);
                    }

                } catch (error) {
                    console.error('Error fetching users:', error);
                }
            },
            async fetchData() {
                try {
                    const trainersResponse = await axios.get('http://localhost:3000/trainers');
                    this.trainers = trainersResponse.data;
                    console.log('Trainers data:', this.trainers);

                    const gymsResponse = await axios.get('http://localhost:3000/gyms');
                    this.gyms = gymsResponse.data;
                    console.log('Gyms data:', this.gyms);

                    const appointmentsResponse = await axios.get('http://localhost:3000/appointments');
                    this.appointments = appointmentsResponse.data;
                    console.log('Appointments data:', this.appointments);

                    const ownersResponse = await axios.get('http://localhost:3000/users');
                    this.owners = ownersResponse.data.filter(user => user.role === 'owner');
                    console.log('Owners data:', this.owners);

                    console.log('Data fetched successfully.');

                    this.fetchUsers();

                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while fetching data. Please try again.';
                }
            },
            async addGym() {
                try {
                    const response = await axios.post(
                        'http://localhost:3000/gyms',
                        {
                            name: this.newGymName,
                            location: this.newGymLocation,
                            owner: this.newGymOwner
                        },
                        {
                            headers: {
                                Authorization: `Bearer ${localStorage.getItem('token')}`
                            }
                        }
                    );
                    this.gyms.push(response.data);
                    this.newGymName = '';
                    this.newGymLocation = '';
                    this.newGymOwner = '';
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while adding a gym. Please try again.';
                }
            },
            async deleteGym(id) {
                try {
                    const response = await axios.delete(`http://localhost:3000/gyms/${id}`);
                    console.log(response);
                    this.gyms = this.gyms.filter(gym => gym._id !== id);
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while deleting a gym. Please try again.';
                }
            },
            async addTrainer() {
                try {
                    const response = await axios.post('http://localhost:3000/trainers', {
                        name: this.newTrainerName,
                        gym: this.newTrainerGym
                    });
                    this.trainers.push(response.data);
                    this.newTrainerName = '';
                    this.newTrainerGym = '';
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while adding a trainer. Please try again.';
                }
            },
            async deleteTrainer(id) {
                try {
                    await axios.delete(`http://localhost:3000/trainers/${id}`);
                    this.fetchData();
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while deleting a trainer. Please try again.';
                }
            },
            async addAppointment() {
                try {
                    let date = new Date(this.newAppointmentDate);
                    let formattedDate = date.toISOString();

                    console.log('Adding appointment:', formattedDate, this.newAppointmentTrainer);

                    const response = await axios.post('http://localhost:3000/appointments', {
                        date: formattedDate,
                        trainer: this.newAppointmentTrainer
                    });

                    console.log('Appointment added:', response.data);

                    this.appointments.push({ _id: response.data._id, date: formattedDate, trainer: response.data.trainer });
                    this.newAppointmentDate = '';
                    this.newAppointmentTrainer = '';
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while adding an appointment. Please try again.';
                }
            },

            async deleteAppointment(id) {
                try {
                    console.log('Deleting appointment with ID:', id);

                    await axios.delete(`http://localhost:3000/appointments/${id}`);
                    this.appointments = this.appointments.filter(appointment => appointment._id !== id);

                    console.log('Appointment deleted successfully.');
                } catch (error) {
                    console.error(error);
                    this.errorMessage = 'An error occurred while deleting an appointment. Please try again.';
                }
            },
            getOwnerNameById(id) {
                const owner = this.owners.find(owner => owner._id === id);
                return owner ? owner.username : 'Unknown';
            },
            getGymNameById(id) {
                const gym = this.gyms.find(gym => gym._id === id);
                return gym ? gym.name : 'Unknown';
            },
            getTrainerNameById(id) {
                const trainer = this.trainers.find(trainer => trainer._id === id);
                return trainer ? trainer.name : 'Unknown';
            }
        },
    };
</script>

<style scoped>

    .users-table {
        width: 100%;
        border-collapse: collapse;
    }

        .users-table th,
        .users-table td {
            border: 1px solid #ddd;
            padding: 8px;
        }

        .users-table th {
            background-color: #4CAF50;
            color: white;
        }


    .users-section {
        background-color: #f2f2f2;
        border-radius: 5px;
        padding: 15px;
        margin-top: 20px;
    }

    .dashboard-container {
        padding: 20px;
    }

    .dashboard-container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: calc(100% - 30px);
    }

    .selection-container {
        display: flex;
        justify-content: space-between;
        width: 100%;
        max-width: 800px;
        margin-bottom: 20px;
    }

    .section {
        width: 30%;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .section-title {
        color: white;
        margin: 0;
        padding: 10px;
        border-radius: 5px;
    }

    .dashboard-title,
    .section-title {
        color: white;
        background-color: rgba(0, 0, 0, 0.77);
        padding: 10px;
        border-radius: 5px;
        margin-top: 60px;
    }

    .error-message {
        color: red;
        padding: 10px;
        border-radius: 5px;
    }

    .form-container,
    .list-container {
        width: 100%;
        max-width: 500px;
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 20px;
    }

    .sections-container {
        display: flex;
        justify-content: space-around;
        width: 80%;
    }

    .input-container {
        margin-bottom: 10px;
    }

    .button-container {
        margin-bottom: 10px;
    }

    .list-item {
        margin-bottom: 10px;
    }

    .list-item-style {
        background-color: #f0f0f0;
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 5px;
    }
</style>
