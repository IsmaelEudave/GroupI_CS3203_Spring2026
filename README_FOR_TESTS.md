# Guide to Running Tests

## Prerequisites

- Git installed on your machine.
- The latest version of Python is installed on your local machine

## Cloning the Feature Repository into your Local Machine

The first step is to clone the repository to your local machine. The steps are listed below:

1. Create a folder that you want to store the project in. 

2. Navigate into this folder and then open your terminal

    - On Windows 11, right click the folder, select "Show more options", then select "Open in Terminal".

    - On MacOS, right click the folder, hold the Option key, then select "New Terminal at Folder".

3. Run the following command with the folder named created in step 1, 

    ```bash
    git clone -b feature/cale-communicationFeature --single-branch https://github.com/IsmaelEudave/GroupI_CS3203_Spring2026.git
    ```

## Executing the Tests

1. Ensure that you are in the root directory of the project.

2. Run the following command.

    ```bash
    python -m unittest -v test_message_service.py
    ```

## Questions or Concerns?

If you have any questions or concerns, please contact Cale Bible at cbible@ou.edu or Discord handle @cale7652