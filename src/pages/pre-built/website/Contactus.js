import React from 'react'
import Head from '../../../layout/head/Head';
import { Icon, PreviewCard } from '../../../components/Component';
import { Button } from 'reactstrap';

function Contactus() {
    return (
        <>
            <Head title="Contact us"></Head>

            <section id="contactSection">
                {/* <div className="contentDiv">
                    <h2 className="heading">Contact Us</h2>
                    <ul>
                        <li>
                            <Icon name="map-pin" />
                            <p>Location : <span>United Kingdom</span></p>
                        </li>
                        <li>
                            <Icon name="mail" />
                            <p>Email : <a href="mailto:csfilantrading@gmail.com" class="menuListLink">csfilantrading@gmail.com</a></p>
                        </li>
                        <li>
                            <Icon name="telegram" />
                            <p>Telegram ID : <span>csfilantrading</span></p>
                        </li>
                    </ul>
                </div> */}
                <div className="contactForm">
                    <PreviewCard className="h-100">
                        <div className="card-head">
                            <h3 className="card-title">Contact Form</h3>
                        </div>
                        <form>
                            <div className="form-group">
                                <label className="form-label" htmlFor="cf-full-name">
                                    Full Name
                                </label>
                                <input type="text" id="cf-full-name" className="form-control" />
                            </div>
                            <div className="form-group">
                                <label className="form-label" htmlFor="cf-email-address">
                                    Email address
                                </label>
                                <input type="text" id="cf-email-address" className="form-control" />
                            </div>
                            <div className="form-group w-100">
                                <label className="form-label" htmlFor="cf-subject">
                                    Subject
                                </label>
                                <input type="text" id="cf-subject" className="form-control" />
                            </div>
                            <div className="form-group w-100">
                                <label className="form-label" htmlFor="cf-default-textarea">
                                    Message
                                </label>
                                <div className="form-control-wrap">
                                    <textarea
                                        className="form-control form-control-sm"
                                        id="cf-default-textarea"
                                        placeholder="Write your message"
                                    ></textarea>
                                </div>
                            </div>
                            <div className="form-group">
                                <Button color="btn" size="lg">
                                    Send Message
                                </Button>
                            </div>
                        </form>
                    </PreviewCard>
                </div>
            </section>
        </>
    )
}

export default Contactus;
