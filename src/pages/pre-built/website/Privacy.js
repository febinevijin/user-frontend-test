import React from "react";
import Content from "../../../layout/content/Content";
import Head from "../../../layout/head/Head";
import { Block, BlockDes, BlockHead, BlockHeadContent, BlockTitle, PreviewCard } from "../../../components/Component";

function Privacy() {
    return (
        <div className="termAndCond">
            <Head title="Terms &amp; Conditions" />
            <Content>
                <div className="content-page wide-md m-auto">
                    <BlockHead size="lg" wide="xs" className="mx-auto">
                        <BlockHeadContent className="text-center">
                            <BlockTitle tag="h2" className="fw-normal">
                                Terms &amp; Policy
                            </BlockTitle>
                            <BlockDes>
                                <p className="lead">
                                    We are on a mission to make the web a better place. The following terms, as well as our Policy and
                                    Terms of Service, apply to all users.
                                </p>
                            </BlockDes>
                        </BlockHeadContent>
                    </BlockHead>
                    <Block>
                        <PreviewCard className="card-bordered">
                            <div className="entry">
                                <h3>Terms and Conditions</h3>
                                <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                </p>
                                <p>The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like). It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
                            </div>
                        </PreviewCard>
                    </Block>
                </div>
            </Content>
        </div>
    )
}

export default Privacy;
