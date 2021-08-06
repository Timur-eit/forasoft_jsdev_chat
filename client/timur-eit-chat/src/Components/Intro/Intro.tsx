import React, { useState, useEffect } from 'react'
import ReactDom from 'react-dom'
import { Formik, Field, Form, FormikHelpers } from 'formik'
import './style.scss'

interface IIntroProps {
    title: string,
    // values: any,
    usersNamesList: string[],
    setUserName: any
}

const Intro: React.FC<IIntroProps> = (props: IIntroProps) => {

    const {
        title,
        // values,        
        setUserName,
    } = props

    return (
        <div className='intro-container'>
        <h1>{title}</h1>
        <p>Please enter your Username</p>
        {/* validation */}

        <Formik
                initialValues={{name: 'John'}}
                onSubmit={(values, {setSubmitting}: FormikHelpers<any>) => {
                    
                    console.log(values.name)
                    setUserName(values.name)
                    setSubmitting(false)
                }}
            >
                <Form>
                    <label htmlFor="name">Username</label>
                    <Field id="name" name="name" placeholder="enter username" required/>
                    <button type="submit">Submit</button>
                </Form>
            </Formik>

        </div>
    )
}

export default Intro
