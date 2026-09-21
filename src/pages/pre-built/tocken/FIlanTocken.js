import React from 'react'
import Head from '../../../layout/head/Head'
import Content from '../../../layout/content/Content'
import { BlockBetween, BlockContent, BlockHead, BlockTitle } from '../../../components/Component'

function FIlanTocken() {
  return (
    <>
      <Head title="Filan Token"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween className="g-3 comingSoon">
            <BlockContent>
              <BlockTitle className='text-white text-center mb-3'>Coming Soon...</BlockTitle>
              
            </BlockContent>
          </BlockBetween>
        </BlockHead>

      </Content>
    </>
  )
}

export default FIlanTocken
