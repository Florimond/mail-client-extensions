import * as React from "react";
import {ProfileCard, ProfileCardProps} from "../ProfileCard/ProfileCard";
import AppContext from '../AppContext';
import { HttpVerb, sendHttpRequest, ContentType } from "../../../utils/httpRequest";
import api from "../../api";

type ContactProps = {};
type ContactState = {};

class Contact extends React.Component<ContactProps, ContactState> {
    constructor(props, context) {
        super(props, context);
    }

  addToContacts = () => {
    const requestJson = {
        name: this.context.partners[this.context.selectedPartner].name,
        email: this.context.partners[this.context.selectedPartner].email,
        company: this.context.partners[this.context.selectedPartner].company.id//this.context.partner.company.id
    }
    const cancellableRequest = sendHttpRequest(HttpVerb.POST, api.baseURL + api.contactCreate, ContentType.Json, this.context.getConnectionToken(), requestJson, true)
    this.context.addRequestCanceller(cancellableRequest.cancel);
    cancellableRequest.promise.then((response) => {
        console.log(response);
        const parsed = JSON.parse(response);
        this.context.setPartnerId(this.context.selectedPartner, parsed.result.id) // TODO remove the first parameter as it is obvious?
        }).catch(function(error) {
        console.log("Error catched: " + error);
        })
    }

    backToSelector = () => {
        this.context.setSelectedPartner(null);
    }
  
  render() {
    const partner = this.context.partners[this.context.selectedPartner];
    const profileCardData: ProfileCardProps = {
        domain: undefined,
        name: partner.name,
        initials: partner.getInitials(),
        icon: partner.image ? "data:image;base64, " + this.context.partner.image : undefined,
        job: partner.title,
        phone: partner.mobile || partner.phone,
        twitter: undefined,
        facebook: undefined,
        crunchbase: undefined,
        linkedin: undefined,
        description: undefined
    }

    // The add button next to Contact should always appear when disconnected, to redirect to the login page.
    // This button should not appear if the partner already has an id (which means it was added already).
    // It should not appear either if the company could not be created.
    return <React.Fragment>
        <div className='tile-title-space'>
            <div className='tile-title'>
                <div className='text'>CONTACT DETAILS</div>
                {(this.context.partners && this.context.partners.length > 1) ? <span className='link-like-button' onClick={this.backToSelector} >&larr; Back</span> : null}
                {!this.context.isConnected() || partner.id === -1 ? <div className='button' onClick={this.context.isConnected() ? this.addToContacts : this.context.navigation.goToLogin}>Add</div> : null}
            </div>
        </div>
        
        <ProfileCard {...profileCardData} />
      </React.Fragment>;
  }
}
Contact.contextType = AppContext;
export default Contact;
