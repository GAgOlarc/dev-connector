import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { textFieldsContext, socialSites, options } from '../common/context'

class CreateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubUsername: '',
            bio: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            instagram: '',
            errors: {}
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        console.log('Submit');
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        const { errors, displaySocialInputs } = this.state;

        const textFields = (
            textFieldsContext.map(textField => (
                <TextFieldGroup
                    key={textField.name}
                    placeholder={textField.placeholder}
                    name={textField.name}
                    value={this.state[textField.name]}
                    onChange={this.onChange}
                    error={errors[textField.name]}
                    info={textField.info}
                />
            ))
        );

        let socialInputs;

        if (displaySocialInputs) {
            socialInputs = (
                socialSites.map(socialSite => (
                    <InputGroup
                        key={socialSite.name}
                        placeholder={socialSite.placeholder}
                        name={socialSite.name}
                        icon={socialSite.icon}
                        value={this.state[socialSite.name]}
                        onChange={this.onChange}
                        error={errors[socialSite.name]}
                    />
                ))
            );
        }

        return (
            <div className="create-profile">
                <div className="container">
                    <div className="col-md-8 m-auto">
                        <h1 className="display-4 text-center">Create Your Profile</h1>
                        <p className="lead text-center">
                            Let's get some information to make your profile stand out
                        </p>
                        <small className="d-block pb-3">* = required fields</small>
                        <form onSubmit={this.onSubmit}>
                            <SelectListGroup
                                name="status"
                                onChange={this.onChange}
                                options={options}
                                error={errors.status}
                                info="Give us an idea of where you are at in your career"
                            />
                            {textFields}

                            <TextAreaFieldGroup
                                placeholder="Short Bio"
                                name="bio"
                                value={this.state.bio}
                                onChange={this.onChange}
                                error={errors.bio}
                                info="Tell us a little about yourself"
                            />

                            <div className="mb-3">
                                <button
                                    type="button"
                                    className="btn btn-light"
                                    onClick={() => (
                                        this.setState(prevState => ({
                                            displaySocialInputs: !prevState.displaySocialInputs
                                        })
                                        )
                                    )}
                                >
                                    Add Social Network Links
                                </button>
                                <span className="text-muted ml-2">Optional</span>
                            </div>
                            {socialInputs}
                            <input type="submit" value="Submit" className="btn btn-info btn-block mt-4" />
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})

export default connect(mapStateToProps)(CreateProfile);
