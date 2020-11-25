import * as React from "react";
import {ProfileCard} from "../ProfileCard/ProfileCard";
import { TextField } from "office-ui-fabric-react/lib/TextField";
import AppContext from '../AppContext';
import "./Selector.css";

type SelectorProps = {};
type SelectorState = {
  //filteredPartners: [{index: number, card: ProfileCardProps}]
  filterText: string;
};

class Selector extends React.Component<SelectorProps, SelectorState> {
    constructor(props, context) {
        super(props, context);

        this.state = {
            filterText: ""
        }
/*
        this.state = {
          filteredPartners: this.context.partners.map((p, index) => ({
            index: index, 
            card: {
              domain: undefined,
              name: p.name,
              initials: p.getInitials(),
              icon: p.image ? "data:image;base64, " + p.image : undefined,
              job: p.title,
              phone: p.mobile || p.phone,
              twitter: undefined,
              facebook: undefined,
              crunchbase: undefined,
              linkedin: undefined,
              description: undefined}
            }))
        };*/
    }

  select = (index: number) => {
    this.context.setSelectedPartner(index);
  }

  filter = (_, text) => {
    this.setState({filterText: text.toLowerCase()});
  }
  
  render() {
    const filteredPartners = this.context.partners.reduce((filtered, p, index, []) => {
      if (p.name.toLowerCase().indexOf(this.state.filterText) !== -1) {
        filtered.push({
          index: index, 
          card: {
            domain: undefined,
            name: p.name,
            initials: p.getInitials(),
            icon: p.image ? "data:image;base64, " + p.image : undefined,
            job: p.title,
            phone: p.mobile || p.phone,
            twitter: undefined,
            facebook: undefined,
            crunchbase: undefined,
            linkedin: undefined,
            description: undefined}
        });
      }
      return filtered;
    }, []);

    return <React.Fragment>
        <div className='tile-title-space'>
            <div className='tile-title'>
                <div className='text'>CHOOSE A CONTACT</div>
            </div>
        </div>
        
        <TextField placeholder="contact name" onChange={this.filter}/>
        {filteredPartners.map((fp) => <div className='selector-element' onClick={() => this.select(fp.index)}><ProfileCard {...fp.card}/></div>)}
      </React.Fragment>;
  }
}
Selector.contextType = AppContext;
export default Selector;
