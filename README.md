# Simulation and Detection of Parkinson's Disease

### This project consisted of four components:
* A simulator to simulate Parkinson's Disease
* A Wristband equipped with accelerometers in three dimensions to detect tremors
* Machine Learning Algorithm to predict the tremors as No Parkinsons, Low, Medium, and High
* The GUI that is the central tool for this project which is this repository
* The backend of the GUI is created in Node.js which is in this repository
* The frontend is created in React.js which is in a different repository
* Frontend Repository can be accessed here: [https://github.com/adamazizi10/Frontend-ParkinsonWristband](https://github.com/adamazizi10/Frontend-ParkinsonWristband)
* Live Site can be accessed here: [https://parkinson-wristband.vercel.app/](https://parkinson-wristband.vercel.app/)
* Demo Email: `demo_user@gmail.com`
* Demo Password: `demouser`

Note: The live site that is hosted generates random datapoints for demonstration purposes. To simulate and detect parkinson's disease, the physical components such as the simulator (Figure 14) and the wristband (Figure 15) are needed.

# The GUI for the Simulation and Detection of Parkinson's Disease
This project's GUI is an essential component of this project as it is integrated with other components to plot and display real-time tremor results as well as the parkinson's level of patients. Every medical professional has personalized access to their dashboard through a secure login/registration process. They may easily add patients, search patient records, and examine patient data and tremor results.

# Pages
The final GUI implementation consists of six different pages:
1) Register Physician (Figure 1): Physicians can register in order to establish an account and use the GUI.
2) Physician Sign In (Figure 2): To access the GUI, physicians can sign in with their current login credentials.
3) Physician Dashboard (Figure 3): Physicians have the option to log out or easily access the "Add Patient" or "Search Patient" tabs.
4) Add Patient (Figure 4): By adding a patient, physicians can start the simulation and detection procedure.
5) Search Patient (Figure 5): Physicians can look up patients' records while keeping private information out of them. Only data saved under the physician’s profile may be accessed, including private patient information.
6) Patient Profile (Figure 6): With this feature, physicians can examine a patient's Parkinson's-related data and analyze tremor data in three dimensions.

<div align="center">
  <img src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/97cc79c9-ae0b-44bc-886f-914ef2380df5" alt="Parkinson's Disease GUI" />
</div>

# Design of the GUI 
The complete GUI pages map is shown in Figure 7. The buttons are highlighted in green and pages are highlighted in yellow. The GUI begins with the "Login" screen and presents the physician with two choices: "Sign in" takes the physician to the dashboard, and "register as physician" takes the physician to the registration page. The vice versa is also true as selecting 'register' takes the physician to the dashboard, and clicking 'Sign In Here' takes the physician back to the Login page.
Three options are provided under the physician dashboard: "Add Patient," "Search Patient," and "Logout." Choosing the 'Logout' option logs the physician out and takes them to the 'Login' page. 'Add Patient' brings up the Add Patient page, where you may either add a patient or go back to the dashboard. Similar to this, selecting 'Search Patient' opens the Search Patient page and allows you to either go back to the dashboard or search for patients. Finally, selecting "add patient" on the Add Patient Page or "view patient" on the Search Patient Page opens the Patient Profile Page where you can return to the dashboard by navigating from there.


<div align="center">
  <img width="612" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/e04e9c6a-3da4-4a0c-9754-52a6f9b998e1">
  <p>Figure 7: The complete map of the GUI</p>
</div>

# Patient Profile Page
The Patient Profile Page is an extremely important page that is splitted into two components. The Tremor Results Graph on the left and the Patient Data on the right. The right side shows the name of the Patient being who is being analyzed, the Parkinson's level of the patient, and the extracted features. Other than the name, the rest of the details change as new data is received (if these data differ). Figure 8 shows the Patient Profile Page.


<div align="center">
  <img width="1509" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/c988332c-1c6b-4a16-b397-6baec884f759" alt="Parkinson's Disease GUI Patient Profile Page" />
  <p>Figure 8: Patient Profile Page</p>
</div>

# Real-Time Data Plotting (the left side)
The GUI is fully integrated with the wristband through an internet connection, whether hotspot or WIFI. The wristband uses websockets to stream its live data on a webpage with the IP address of the internet connection. The GUI then accesses that IP address, receives the live data, specifically acceleration data, and plots it indefinitely. Figure 9 shows the indefinite plotting of Real-Time Data from the wristband.

<div align="center">
  <img width="714" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/069a876d-97d0-471a-a769-bf169f4e92ed">
  <p>Figure 9: Indefinite Plotting of Real-Time Data</p>
</div>

# Information Pipeline
Five pages communicate with the backend by sending HTTP requests in order to either create/update new data or retrieve previously stored information. The basic HTTP methods of GET, POST, PUT, and DELETE are used. A POST request, which is frequently used in situations like profile creation, sends data to the backend, whereas a GET request normally retrieves data from the backend. PUT requests work similarly to POST requests with the only difference being that POST creates data and PUT updates data. The DELETE request deletes the requested data. 
There are several ways that data is transmitted, including the request body and the URL. For example, a URL such as hello.com/123, where '123' denotes the request identification, might be used. As an alternative, information can be safely sent via the request body, as demonstrated by 'Name': 'John,' which functions discreetly in the background and is hidden from view.

<div align="center">
  <img width="607" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/b30da1fd-c2f7-4057-b282-8375a374b6e9">
  <p>Figure 10: Information Pipeline for Register Physician and Sign In Physician Pages</p>
</div>

Upon a new physician's registration, the Frontend sends a POST request to the backend, containing the physician's first and last names, email address, and password in the request body. The backend checks to see if the doctor is already listed in the database after obtaining this data. An error is sent if the doctor exists; otherwise, the data is saved. The email address and password are included in the request body of a GET request that the frontend sends to the backend in order to authenticate physicians. The credentials are validated by the backend upon arrival. If this is accurate, the sign-in is permitted, and the doctor's data is received by the Frontend, which stores it locally for easy access. An error message is sent when the credentials are entered incorrectly. 
The physician dashboard does not currently send HTTP queries to the backend because it only needs to be used for navigation and doesn't need any more data. For the personalized welcome, which reads "Good Morning/Afternoon/Evening, Dr. [Physician’s last name]," the dashboard just needs the doctor's name. This information is retrieved from local storage, where it was kept during the physician’s sign-in.

<div align="center">
  <img width="629" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/4fd49a17-2f86-4736-bc75-fa1443f808ce">
  <p>Figure 11: Pipeline for Add Patient, Search Patient Profile, and Patient Profile Page</p>
</div>

The Frontend sends the patient's information, including first_name, last_name, and age, over a POST request whenever a doctor adds a new patient. The backend confirms if the patient already exists after getting this request. If not, the patient's data is added to the 'patient' table along with the doctor's doctor_id, who added the patient. 
Two immediate GET requests are made when a doctor visits the Search Patient Profile page: "/get_all_patient_data" and "/get_all_doctor_data." In order to facilitate the populating of the corresponding tables in the "search patient page", these requests retrieve all patient and physician data from the backend. Only when the "View Patient" button is pressed does the third GET request, "/get_specific_patient_details," take place, requesting particular details about the chosen patient. The physician receives this request and is taken to the Patient Profile Page, which provides extensive information on the selected patient. Lastly, a request for the patient's data is made on the Patient Profile Page, and the data is then shown on the page. Furthermore, this page retrieves and displays microcontroller data, which ideally represents position data.

# Testing the GUI
To test the GUI, many approaches were used such as manual testing, creating mock streaming data sets to simulate the wristband, creating mock Machine Learning outputs to mock the real version.

## Manual Testing of the GUI
The GUI account system was manual tested without any automation scripts. For example, for the registration page, after the addition or removal of features, the member responsible for the GUI would have to re-create another account to see if the desired functionality is implemented successfully. This type of testing was the most time-consuming as it fully depended on a person instead of it being automated.

## Creating a Mock Server to replicate the Wristband Website
Earlier in the project stages, the GUI and the wristband were not interacting as they needed time to be completed individually. However, the implementation of the GUI could not be delayed until the wristband is fully functional. This is why a mock web page was created to replicate the real webpage of the wristband which can be seen in Figure 12. This mock webpage would generate data in the same form as the real webpage does. The GUI used this mock webpage earlier in the project to test other features that depended on this such as the Patient Profile Page which plots 3D data. Therefore, without this mock webpage, it would have to delay the testing of Patient Profile Page until the wristband is completed.

<div align="center">
  <img width="157" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/e0a79131-f03c-4015-9fb5-64a3f6c203c6">
  <p>Figure 12: The mock webpage that replicates the real webpage of the wristband</p>
</div>

## Creating Mock Machine Learning Algorithm Outputs
The GUI also did not have access to the Machine Learning Algorithm that predicts the parkinson’s level of the patient as well as performs feature extraction. Therefore, for the GUI to test the display of data such as the parkinson’s level, it would need a mock python script (later replaced with the actual machine learning algorithm) to be used to output four random levels for parkinson’s disease: No Parkinson, Low, Medium, and High.
<div align="center">
  <img width="473" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/2cfec393-1814-46c5-8f18-854474255d99">
  <p>Figure 13: Approaches used for testing Before and After Integration</p>
</div>

<div align="center">
  <img width="411" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/e2323d1c-ada2-4e01-9767-80054bff07f3">
  <p>Figure 14: The Simulator of Parkinson's Disease</p>
</div>

<div align="center">
  <img width="616" alt="image" src="https://github.com/adamazizi10/Frontend-ParkinsonWristband/assets/106051947/d7cc757e-fedd-4795-b25b-311d886a9141">
  <p>Figure 15: The Wristband for Parkinson's Disease Detection equipped with accelerometers and Sensors</p>
</div>

# Conclusion
The GUI for simulating and detecting Parkinson's Disease is as an important interface which is aimed at aiding medical professionals in diagnosis and monitoring. Through various testing methodologies such as manual testing, mock server creation, and mock machine learning outputs, the GUI demonstrates correct functionality, reliability, and the readiness to be used in a healthcare setting.
