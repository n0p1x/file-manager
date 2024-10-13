# File Manager

A CLI-based File Manager application built with Node.js.

## Prerequisites

- Node.js (version 22.9.0 or higher)

## Installation

1. Clone this repository
2. Navigate to the project directory

## Usage

Start the File Manager by running:

```bash
npm run start -- --username=your_username
```

Replace `your_username` with your desired username.

## Available Commands

- Navigation:
  - `up`: Go up one directory
  - `cd path_to_directory`: Change current directory
  - `ls`: List files and directories in the current directory

- File Operations:
  - `cat path_to_file`: Display file contents
  - `add file_name`: Create a new file
  - `rn path_to_file new_filename`: Rename a file
  - `cp path_to_file path_to_new_directory`: Copy a file
  - `mv path_to_file path_to_new_directory`: Move a file
  - `rm path_to_file`: Delete a file

- OS Info:
  - `os --EOL`: Display End-Of-Line marker
  - `os --cpus`: Display CPU information
  - `os --homedir`: Display home directory
  - `os --username`: Display current system username
  - `os --architecture`: Display CPU architecture

- Hash Calculation:
  - `hash path_to_file`: Calculate and display file hash

- Compression:
  - `compress path_to_file path_to_destination`: Compress a file
  - `decompress path_to_file path_to_destination`: Decompress a file

- Exit:
  - `.exit`: Exit the application

## Error Handling

- If an invalid input is provided, "Invalid input" will be displayed.
- If an operation fails, "Operation failed" will be displayed.

## Notes

- The application starts in the user's home directory.
- The current working directory is displayed after each operation.
- Users cannot navigate above the root directory.
