import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { textFieldsContext, socialSites, listOptions } from '../common/context';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';

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

    componentDidMount() {
        this.props.getCurrentProfile();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }

        if (nextProps.profile.profile) {
            const profile = nextProps.profile.profile;

            // Bring skills array back to CSV
            const skillsCSV = profile.skills.join(',');

            // If profile field doesn't exist, make empty string
            profile.company = !isEmpty(profile.company) ? profile.company : '';
            profile.website = !isEmpty(profile.website) ? profile.website : '';
            profile.location = !isEmpty(profile.location) ? profile.location : '';
            profile.githubUsername = !isEmpty(profile.githubUsername) ? profile.githubUsername : '';
            profile.bio = !isEmpty(profile.bio) ? profile.bio : '';
            profile.social = !isEmpty(profile.social) ? profile.social : {};
            profile.social.twitter = !isEmpty(profile.social.twitter) ? profile.social.twitter : '';
            profile.social.facebook = !isEmpty(profile.social.facebook) ? profile.social.facebook : '';
            profile.social.linkedin = !isEmpty(profile.social.linkedin) ? profile.social.linkedin : '';
            profile.social.youtube = !isEmpty(profile.social.youtube) ? profile.social.youtube : '';
            profile.social.instagram = !isEmpty(profile.social.instagram) ? profile.social.instagram : '';

            // Set component fields state
            this.setState({
                handle: profile.handle,
                company: profile.company,
                website: profile.website,
                location: profile.location,
                status: profile.status,
                skills: skillsCSV,
                githubUsername: profile.githubUsername,
                bio: profile.bio,
                twitter: profile.social.twitter,
                facebook: profile.social.facebook,
                linkedin: profile.social.linkedin,
                youtube: profile.social.youtube,
                instagram: profile.social.instagram
            })
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubUsername: this.state.githubUsername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram
        };
        this.props.createProfile(profileData, this.props.history);
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
                        <h1 className="display-4 text-center">Edit Your Profile</h1>
                        <form onSubmit={this.onSubmit}>
                            <SelectListGroup
                                name="status"
                                value={this.state.status}
                                onChange={this.onChange}
                                options={listOptions}
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
    createProfile: PropTypes.func.isRequired,
    getCurrentProfile: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    errors: state.errors
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(CreateProfile));
