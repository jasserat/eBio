from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import BaseModel,conlist
from typing import List,Optional
import pandas as pd
from model import recommend,output_recommended_recipes
from Generate_Recommendations import Generator
from random import uniform as rnd
from ImageFinder.ImageFinder import get_images_links as find_image
import pandas as pd


dataset=pd.read_csv('./Data/dataset.csv',compression='gzip')



class params(BaseModel):
    n_neighbors:int=5
    return_distance:bool=False

class PredictionIn(BaseModel):
    nutrition_input:conlist(float, min_items=9, max_items=9)
    ingredients:list[str]=[]
    params:Optional[params]


class Recipe(BaseModel):
    Name:str
    CookTime:str
    PrepTime:str
    TotalTime:str
    RecipeIngredientParts:list[str]
    Calories:float
    FatContent:float
    SaturatedFatContent:float
    CholesterolContent:float
    SodiumContent:float
    CarbohydrateContent:float
    FiberContent:float
    SugarContent:float
    ProteinContent:float
    RecipeInstructions:list[str]

class PredictionOut(BaseModel):
    output: Optional[List[Recipe]] = None




nutritions_values=['Calories','FatContent','SaturatedFatContent','CholesterolContent','SodiumContent','CarbohydrateContent','FiberContent','SugarContent','ProteinContent']

class Person:

    def __init__(self,age,height,weight,gender,activity,meals_calories_perc,weight_loss):
        self.age=age
        self.height=height
        self.weight=weight
        self.gender=gender
        self.activity=activity
        self.meals_calories_perc=meals_calories_perc
        self.weight_loss=weight_loss
    def calculate_bmi(self,):
        bmi=round(self.weight/((self.height/100)**2),2)
        return bmi

    def display_result(self,):
        bmi=self.calculate_bmi()
        bmi_string=f'{bmi} kg/m²'
        if bmi<18.5:
            category='Underweight'
            color='Red'
        elif 18.5<=bmi<25:
            category='Normal'
            color='Green'
        elif 25<=bmi<30:
            category='Overweight'
            color='Yellow'
        else:
            category='Obesity'    
            color='Red'
        return bmi_string,category,color

    def calculate_bmr(self):
        if self.gender=='Male':
            bmr=10*self.weight+6.25*self.height-5*self.age+5
        else:
            bmr=10*self.weight+6.25*self.height-5*self.age-161
        return bmr

    def calories_calculator(self):
        activites=['Little/no exercise', 'Light exercise', 'Moderate exercise (3-5 days/wk)', 'Very active (6-7 days/wk)', 'Extra active (very active & physical job)']
        weights=[1.2,1.375,1.55,1.725,1.9]
        weight = weights[activites.index(self.activity)]
        maintain_calories = self.calculate_bmr()*weight
        return maintain_calories

    def generate_recommendations(self,):
        total_calories=self.weight_loss*self.calories_calculator()
        recommendations=[]
        for meal in self.meals_calories_perc:
            meal_calories=self.meals_calories_perc[meal]*total_calories
            if meal=='breakfast':        
                recommended_nutrition = [meal_calories,rnd(10,30),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,10),rnd(0,10),rnd(30,100)]
            elif meal=='launch':
                recommended_nutrition = [meal_calories,rnd(20,40),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,20),rnd(0,10),rnd(50,175)]
            elif meal=='dinner':
                recommended_nutrition = [meal_calories,rnd(20,40),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,20),rnd(0,10),rnd(50,175)] 
            else:
                recommended_nutrition = [meal_calories,rnd(10,30),rnd(0,4),rnd(0,30),rnd(0,400),rnd(40,75),rnd(4,10),rnd(0,10),rnd(30,100)]
             
            generator=Generator(recommended_nutrition)
            prediction_input=generator.generate()
            recommendation_dataframe=recommend(dataset,prediction_input['nutrition_input'],prediction_input['ingredients'],prediction_input['params'])
            output=output_recommended_recipes(recommendation_dataframe)
            recommendations.append(output)
        for recommendation in recommendations:  
            for recipe in recommendation:
                recipe['image_link']=find_image(recipe['Name']) 
        return recommendations


#bmi_string,category,color = person.display_result()
#maintain_calories=person.calories_calculator()      
#meals=person.meals_calories_perc
#person = Person(age,height,weight,gender,activity,meals_calories_perc,weight_loss)
#recommendations=person.generate_recommendations()
#output_recomm=zip(meals,recommendations)   

app = Flask(__name__)
CORS(app)

class PredictionFoodIn(BaseModel):
    age: int
    height: int
    weight: int
    gender: str
    activity: str
    number_of_meals: int
    option: str


@app.get("/")
def home():
    return {"health_check": "OK"}


@app.route("/predict", methods=['POST'])
def update_item():

    data = request.get_json()

    if data['number_of_meals']==3:
        meals_calories_perc={'breakfast':0.35,'lunch':0.40,'dinner':0.25}
    elif data['number_of_meals']==4:
        meals_calories_perc={'breakfast':0.30,'morning snack':0.05,'lunch':0.40,'dinner':0.25}
    else:
        meals_calories_perc={'breakfast':0.30,'morning snack':0.05,'lunch':0.40,'afternoon snack':0.05,'dinner':0.20}

    plans=["Maintain weight","Mild weight loss","Weight loss","Extreme weight loss"]
    weights=[1,0.9,0.8,0.6]
    
    losses=['-0 kg/week','-0.25 kg/week','-0.5 kg/week','-1 kg/week']    
    
    weight_loss=weights[plans.index(data['option'])]

    person = Person(
        data['age'],
        data['height'],
        data['weight'],
        data['gender'],
        data['activity'],
        meals_calories_perc,
        weight_loss  
    )

    bmi_string, category, color = person.display_result()
    maintain_calories = person.calories_calculator()      
    meals = person.meals_calories_perc
    recommendations = person.generate_recommendations()
    #output_recomm = zip(meals, recommendations)
    output_recomm = [{'meal': meal, 'recommendation': recommendation} for meal, recommendation in zip(meals, recommendations)]

    response_dict = {
        "output_recomm": output_recomm,
        "meals": meals,
        "maintain_calories": maintain_calories,
        "bmi_string": bmi_string,
        "category": category,
        "color": color
    }

    return jsonify(response_dict)




if __name__ == '__main__':
    app.run(debug=True,port=5555)    

