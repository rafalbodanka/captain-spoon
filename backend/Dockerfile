FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
RUN pip install python-dotenv
COPY . .
EXPOSE 8000
CMD ["python", "-m", "dotenv", "run", "python", "manage.py", "runserver", "0.0.0.0:8000"]
