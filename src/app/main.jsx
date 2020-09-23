
import React from 'react';
import ReactDOM from 'react-dom';
import { Upload } from '@progress/kendo-react-upload';

const fileStatuses = [
    'UploadFailed',
    'Initial',
    'Selected',
    'Uploading',
    'Uploaded',
    'RemoveFailed',
    'Removing'
];

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            files: [],
            events: [],
            filePreviews: {}
        };
    }

    onAdd = (event) => {
        const afterStateChange = () => {
            event.affectedFiles
                .filter(file => !file.validationErrors)
                .forEach(file => {
                    const reader = new FileReader();

                    reader.onloadend = (ev) => {
                        this.setState({
                            filePreviews: {
                                ...this.state.filePreviews,
                                [file.uid]: ev.target.result
                            }
                        });
                    };

                    reader.readAsDataURL(file.getRawFile());
                });
        };

        this.setState({
            files: event.newState,
            events: [
                ...this.state.events,
                `File selected: ${event.affectedFiles[0].name}`
            ]
        }, afterStateChange);
    }

    onRemove = (event) => {
        const filePreviews = {
            ...this.state.filePreviews
        };

        event.affectedFiles.forEach(file => {
            delete filePreviews[file.uid];
        });

        this.setState({
            files: event.newState,
            events: [
                ...this.state.events,
                `File removed: ${event.affectedFiles[0].name}`
            ],
            filePreviews: filePreviews
        });
    }

    onProgress = (event) => {
        this.setState({
            files: event.newState,
            events: [
                ...this.state.events,
                `On Progress: ${event.affectedFiles[0].progress} %`
            ]
        });
    }

    onStatusChange = (event) => {
        const file = event.affectedFiles[0];

        this.setState({
            files: event.newState,
            events: [
                ...this.state.events,
                `File '${file.name}' status changed to: ${fileStatuses[file.status]}`
            ]
        });
    }

    render() {
        return (
            <div>
                <Upload
                    batch={false}
                    multiple={true}
                    files={this.state.files}
                    onAdd={this.onAdd}
                    onRemove={this.onRemove}
                    onProgress={this.onProgress}
                    onStatusChange={this.onStatusChange}
                    withCredentials={false}
                    saveUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/save'}
                    removeUrl={'https://demos.telerik.com/kendo-ui/service-v4/upload/remove'}
                />
                 {/* <div className={'example-config'} style={{ marginTop: 20 }}>
                    <ul className={'event-log'}>
                        {
                            this.state.events.map(event => <li>{event}</li>)
                        }
                    </ul>
                </div> */}
                {
                    this.state.files.length?
                    <div className={'img-preview example-config'}>
                        <h3>Preview selected images</h3>
                        {
                            Object.keys(this.state.filePreviews).map((fileKey) =>{
                                // console.log(fileKey)
                                (
                                    <img
                                        src={this.state.filePreviews[fileKey]}
                                        alt={'image preview'}
                                        style={{ width: 200, margin: 10 }}
                                    />)
                            })
                        }
                    </div> : undefined
                }
            </div>
        );
    }
}

ReactDOM.render(
    <App />,
    document.querySelector('my-app')
);

