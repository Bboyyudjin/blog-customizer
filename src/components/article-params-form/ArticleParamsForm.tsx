import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from '../../ui/radio-group';
import { Select } from '../../ui/select';
import { Separator } from '../../ui/separator';
import { Text } from '../../ui/text';

import styles from './ArticleParamsForm.module.scss';
import { useState, useRef, useEffect } from 'react';
import {
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
	defaultArticleState,
	ArticleStateType
} from 'src/constants/articleProps'
import clsx from 'clsx';

type ArticleParamsFormProps = {
	articleState: ArticleStateType
	onApply: (newState: ArticleStateType) => void
	onReset: () => void
}

export const ArticleParamsForm = ({articleState, onApply, onReset}:ArticleParamsFormProps) => {
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [formState, setFormState] = useState(articleState)
	const formRef = useRef<HTMLElement|null>(null)

	const handleChange = <K extends keyof ArticleStateType>(option:K, value:ArticleStateType[K]) => {
		setFormState((formState)=> ({...formState, [option]:value}))
	}

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			const { target } = event;
			if (target instanceof Node && !formRef.current?.contains(target)) {
				setIsFormOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClick);

		return () => {
			document.removeEventListener('mousedown', handleClick);
		};
	}, []);

	const handleReset = () => {
		setFormState(defaultArticleState)
		onReset()
	}

	const handleApply = () => {
		onApply(formState)
	}

	return (
		<>
			<ArrowButton
			  isOpen={isFormOpen}
			  onClick={() => {setIsFormOpen(!isFormOpen)}} />
			<aside
			  className={clsx(styles.container, {
	    		[styles.container_open]: isFormOpen}
			  )}
			  ref={formRef}>
				<form
				className={styles.form}
				onSubmit={(e) => {
					e.preventDefault()
					handleApply()
				}}
				onReset={() => handleReset()}>
					<Text
					  as='h3'
					  size={31}
					  weight={800}
                      uppercase
					>Задайте параметры</Text>
					<Select
						selected={formState.fontFamilyOption}
						title='Шрифт'
						options={fontFamilyOptions}
						onChange={(value)=> handleChange('fontFamilyOption', value)}
					></Select>
					<RadioGroup
					  selected={formState.fontSizeOption}
					  title='Размер шрифта'
					  options={fontSizeOptions}
					  name='fontSizeOption'
					  onChange={(value)=> handleChange('fontSizeOption', value)}
					></RadioGroup>
					<Select
						selected={formState.fontColor}
						title='Цвет шрифта'
						options={fontColors}
						onChange={(value)=> handleChange('fontColor', value)}
					></Select>
					<Separator></Separator>
					<Select
						selected={formState.backgroundColor}
						title='Цвет фона'
						options={backgroundColors}
						onChange={(value)=> handleChange('backgroundColor', value)}
					></Select>
					<Select
						selected={formState.contentWidth}
						title='Ширина контента'
						options={contentWidthArr}
						onChange={(value)=> handleChange('contentWidth', value)}
					></Select>
					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear'/>
						<Button title='Применить' htmlType='submit' type='apply'/>
					</div>
				</form>
			</aside>
		</>
	);
};
