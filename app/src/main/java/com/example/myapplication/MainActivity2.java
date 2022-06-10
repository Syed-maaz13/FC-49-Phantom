package com.example.myapplication;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;
import android.view.WindowManager;

import androidx.annotation.RequiresApi;


public class MainActivity2 extends AppCompatActivity {
    EditText username,password;
    Button signInBtn;
    int count=0;
    @RequiresApi(api = Build.VERSION_CODES.JELLY_BEAN)

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_SECURE, WindowManager.LayoutParams.FLAG_SECURE);
        setContentView(R.layout.activity_main);
        setContentView(R.layout.activity_main2);
        username = findViewById(R.id.username);
        password = findViewById(R.id.password);
        signInBtn = findViewById(R.id.signin);
        Bundle bundle = getIntent().getExtras();
        String uname = bundle.getString("username");
        String pwd = bundle.getString("password");
        signInBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                String user = username.getText().toString();
                String pass = password.getText().toString();
                if(user.equals(uname) && pass.equals(pwd)){
                    Toast.makeText(MainActivity2.this,"Success", Toast.LENGTH_SHORT).show();
                }
                else {
                    count++;
                    if (count >= 3) {
                        signInBtn.setEnabled(false);
                    } else {
                        Toast.makeText(MainActivity2.this,"Failed", Toast.LENGTH_SHORT).show();
                    }
                }
                Intent intent = new Intent(MainActivity2.this,MainActivity3.class);
                intent.putExtras(bundle);
                startActivity(intent);
            }
        });
    }
}